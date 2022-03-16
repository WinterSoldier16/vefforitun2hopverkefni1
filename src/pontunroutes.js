import express from 'express';
import jwt from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { 
    requireAuthentication,  
} from './auth/passport.js';

const {
    TOKEN_LIFETIME: tokenLifetime = 3600,
    JWT_SECRET: jwtSecret,
} = process.env;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

export const pRoute = express.Router();

