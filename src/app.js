import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy, ExtractJwt } from 'passport-jwt';
//import { router as apiRouter } from './api/index.js';
//import passport from './auth/passport.js';
import { route as userroutes } from './userroutes.js';
import { vRoute as voruroutes } from './voruroutes.js';
import { route as cartroutes } from './cartroutes.js';
import expressWs from 'express-ws';

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
  DATABASE_URL: databaseUrl,
  JWT_SECRET: jwtSecret,
} = process.env;

if (!jwtSecret || !databaseUrl) {
  console.error('Vantar .env gildi');
  process.exit(1);
}

const app = express();
expressWs(app);

// Notum JSON middleware til að geta tekið við JSON frá client
app.use(express.json());
app.use(userroutes);
app.use(voruroutes);
app.use(cartroutes);

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