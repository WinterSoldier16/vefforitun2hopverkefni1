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
    updateCat,
    removeCat,
    findVoruByCatQue,
    removeVoru
} from './lib/vorur.js';

import { 
    requireAuthentication,  
} from './auth/passport.js';
import { uploadImage } from './utils/cloudinary.js';

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
    const search = req.query.search;
    const category = req.query.category;
    // const search = req.query.search;
    // console.error(category);
    if(category && !search) {
        const listFlokkByCat = await findVoruByCategory(category);
        return res.json({ listFlokkByCat });
    }
    if(search && !category) {
        const listFlokkBySearch = await findVoruByQuery('%' + search + '%');
        return res.json({ listFlokkBySearch });
    }
    if(category && search) {
        const listFlokkBySOgC = await findVoruByCatQue(category, '%' + search + '%');
        return res.json({ listFlokkBySOgC });
    }
    if(!category && !search) {
        const listAllVorur = await findAllVorur();
        return res.json({ listAllVorur });
    }
});
// eftir að laga, fer eftir hvað óli segir
vRoute.post('/menu', requireAuthentication, async (req, res) => {
    // const { title, price, description, flokkar  = '' } = req.body;
    const { imagePath } = req.file;
    let image;
    if(!req.file) {
        return res.status(401).json({ error: 'Please upload an image'});
    }
    if(req.user.admin !== true) {
        return res.status(401).json({ error: 'Need admin priviliges to create new vöru'});
    }
    try {
        const uploadResult = await uploadImage(imagePath);
        if(!uploadResult || !uploadResult.secure_url) {
            throw new Error('no secure_url from cloudinary upload');
        }

        image = uploadResult.secure_url;
    } catch (e) {
        logger.error('Unable to upload file to cloudinary', e);
        return res.status(500).end();
    }
    if(!title || !price || !description || !image || !flokkar) {
        return res.status(401).json({ error: 'Please provide title, price, description , image url and flokkar'});
    }
    const nyvara = await createVoru(title, price, description, poster , flokkar);
    if(nyvara) {
        return res.json({ data: 'Vara búin til' });
    }
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

vRoute.post('/categories', requireAuthentication, async (req, res) => {
    const { title = '' } = req.body;
    if(req.user.admin === true) {
        const createdFlokkur = await createCat(title);
        if(createdFlokkur) {
            return res.json({ data: 'Flokkur búinn til' });
        }
    }
    return res.status(401).json({ error: 'Need admin priviliges to create new flokkur'});
});

vRoute.patch('/categories/:id', requireAuthentication, async (req, res) => {
    const { id } = req.params;
    const { title = '' } = req.body;
    if(req.user.admin === true) {
        const updateCategory = await updateCat(id, title);
        return res.json({ data: 'Flokki hefur verið breytt' });
    } 
    
    return res.status(401).json({ error: 'Need admin priviliges to create new flokkur'});
});

vRoute.delete('/categories/:id', requireAuthentication, async( req, res) => {
    const { id } = req.params;
    if(req.user.admin === true) {
        const removecat = await removeCat(id);
        return res.json({ data: 'Flokki var eytt' });
    }
    return res.status(401).json({ error: 'Need admin priviliges to delete flokkur'});
});