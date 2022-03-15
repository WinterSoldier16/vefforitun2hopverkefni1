import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
//import { router as apiRouter } from './api/index.js';
//import passport from './auth/passport.js';


import {
  comparePasswords,
  findByUsername,
  findById,
  findAllUsers,
  createUser,
} from './lib/users.js';

dotenv.config();

const {
  PORT: port = 3000,
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 3600, //TODO: Make this number slightly smaller
  DATABASE_URL: databaseUrl,
} = process.env;

if (!jwtSecret || !databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

const app = express();

// Notum JSON middleware til að geta tekið við JSON frá client
app.use(express.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  // fáum id gegnum data sem geymt er í token
  const user = await findById(data.id);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.json({
    login: '/login',
    admin: '/admin',
    users: '/users',
  });
});

app.post('/users/login', async (req, res) => {
  const { username, password = '' } = req.body;

  const user = await findByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'No such user' });
  }

  const passwordIsCorrect = await comparePasswords(password, user.password);

  if (passwordIsCorrect) {
    const payload = { id: user.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

function requireAuthentication(req, res, next) {
  return passport.authenticate(
    'jwt',
    { session: false },
    (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const error = info.name === 'TokenExpiredError'
          ? 'expired token' : 'invalid token';

        return res.status(401).json({ error });
      }

      // Látum notanda vera aðgengilegan í rest af middlewares
      req.user = user;
      return next();
    },
  )(req, res, next);
}

app.get('/admin', requireAuthentication, (req, res) => {
  res.json({ data: 'top secret' });
});

app.get('/users', requireAuthentication, async (req, res) => {
  if (req.user.admin === true) {
    const listOfAllUsers = await findAllUsers();
    return res.json({ listOfAllUsers });
  }
  return res.status(401).json({ error: 'Need admin priviliges to'})
});

app.post('/users/register', async (req, res) => {
  const { name, username, password = '' } = req.body;

  if (!name || !username || !password) {
    return res.status(401).json({ error: 'Please provide name, username and password' });
  }
  const createdUser = await createUser(name, username, password, false);

  if (createdUser) {
    return res.json({ name, username });
  }
  return res.json({ data: 'User was not created, please try again with different username' });
});

app.get('/users/me', requireAuthentication, async (req, res) => {
  console.error(req.user.id);
  const audkenni = req.user.id;
  const nafn = req.user.name;
  res.json({ audkenni, nafn });
});

app.get('/users/:id', requireAuthentication, async (req, res) => {
  const { id } = req.params;
  const user = await findById(id);
  if (req.user.admin === true) {
    return res.json(user);
  }
  return res.json({ data: 'Need admin privileges to continue' });
});



function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});