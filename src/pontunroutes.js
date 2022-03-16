import express from 'express';
import jwt from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { 
    requireAuthentication,  
} from './auth/passport.js';
import { createPontun, findAllPontun, findPontunById, findPontunByIdStatus } from './lib/pontun.js';

const {
    TOKEN_LIFETIME: tokenLifetime = 3600,
    JWT_SECRET: jwtSecret,
} = process.env;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

export const pRoute = express.Router();

pRoute.get('/orders', async (req, res) => {
    const listAllOrders = await findAllPontun();

    return res.json({ listAllOrders });
});

pRoute.post('/orders', async (req, res) => {
    const { name, idkarfa } = req.body;
    if(!name || !idkarfa) {
        return res.status(401).json({ error: 'Please provide a name on the order and the cartid' });
    }
    const nypontun = await createPontun(idkarfa, name);
    if(nypontun) {
        return res.json({ nypontun });
    }
});

pRoute.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const pontunid = await findPontunById(id);
    return res.json({ pontunid });
});

pRoute.get('orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const status = req.query.status;

    const idstatus = await findPontunByIdStatus(id, status);
    return res.json({ idstatus });

});