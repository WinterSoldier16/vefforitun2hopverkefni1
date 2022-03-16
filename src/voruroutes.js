import express from 'express';
import jwt from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';

import {
    findAllVorur,
    findVoruById,
    findVoruByCategory,
    findVoruByQuery,
    findAllVorurCat,
    findCatById,
    createVoru,
    updateVoru,
    createCat,
    updateCat
} from './lib/vorur.js';

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

export const vRoute = express.Router();

vRoute.get('/menu', async (req, res) => {
    const category = req.query.category;
    const search = req.query.search;
    console.error(category);
    if(category && !search) {
        const listFlokkByCat = await findVoruByCategory(category);
        return res.json({ listFlokkByCat });
    }
    if(search && !category) {
        const listFlokkBySearch = await findVoruByQuery(search);
        return res.json({ listFlokkBySearch });
    }
    if(category && search) {
        const listFlokkBySOgC = await findVoruByCatQue(category, search);
        return res.json({ listFlokkBySOgC });
    }
    if(!category && !search) {
        const listAllVorur = await findAllVorur();
        return res.json({ listAllVorur });
    }
});

vRoute.post('/menu', requireAuthentication, async (req, res) => {
    const { title, price, description, image, flokkar  = '' } = req.body;
    if(req.user.admin === true) {
        if(!title || !price || !description || !image || !flokkar) {
            return res.status(401).json({ error: 'Please provide title, price, description , image url and flokkar'});
        }
        const nyvara = await createVoru(title, price, description, image, flokkar);
        if(nyvara) {
            return res.json({ data: 'Vara búin til' });
        }
    }
    return res.status(401).json({ error: 'Need admin priviliges to create new vöru'});
});

vRoute.get('/menu/:id', async (req, res) => {
    const { id } = req.params;
    const menu = await findVoruById(id);
    return res.json({ menu });
});

vRoute.patch('/menu/:id', requireAuthentication, async (req, res) => {
    const { id } = req.params;
    const { title, price, description, image, flokkar = '' } = req.body;
    const updatevara = await updateVoru(id, title, price, description, image, flokkar);
    return res.json({ updatevara });
});

vRoute.delete('/menu/:id', requireAuthentication, async (req, res) => {
    const { id } = req.params;
    if(req.user.admin === true) {
        const remove  = await removeVoru(id);
        return res.json({ data: 'Vöru var eytt' });
    }
    return res.status(401).json({ error: 'Need admin priviliges to delete vöru'});

});

vRoute.get('/categories', async (req, res) => {
    const listAllflokkar = await findAllVorurCat();
    return res.json({ listAllflokkar });
});