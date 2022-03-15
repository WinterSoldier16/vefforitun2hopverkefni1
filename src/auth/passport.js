import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import {
    findById,
  } from './lib/users.js';

const {
    JWT_SECRET: jwtSecret,
    TOKEN_LIFETIME: tokenLifetime = 3600,
} = process.env;

if (!jwtSecret) {
    console.error('Vantar .env gildi');
    process.exit(1);
}

async function strat(data, next) {
    const user = await findById(data.id);

    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
}

export function requireAuthentication(req, res, next) {
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

