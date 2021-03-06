import express from 'express';
import jwt from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { 
    requireAuthentication,  
} from './auth/passport.js';

import { createPontun, findAllPontun, findPontunById, findPontunByIdStatus, updatePontunIdStatus } from './lib/pontun.js';


const {
    TOKEN_LIFETIME: tokenLifetime = 3600,
    JWT_SECRET: jwtSecret,
} = process.env;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

export const pRoute = express.Router();

pRoute.get('/orders', requireAuthentication, async (req, res) => {
    if(req.user.admin === true) {
        const listAllOrders = await findAllPontun();
        return res.json({ listAllOrders });
    }
    return res.status(401).json({ error: 'Need admin priviliges to view orders'});
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

pRoute.get('/orders/:id/status', async (req, res) => {
    const { id } = req.params;

    const idstatus = await findPontunByIdStatus(id);
    return res.json({ idstatus });

});

pRoute.post('/orders/:id/status', requireAuthentication, async (req, res) => {
    const { id } = req.params;

    if(req.user.admin === true) {
        const changeStatus = await updatePontunIdStatus(id);
        return res.json({ changeStatus });
    }
    return res.status(401).json({ error: 'Need admin priviliges to update order status'});
});
