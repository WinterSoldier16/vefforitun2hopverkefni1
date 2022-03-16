import express from 'express';

import {
  createCart,
  getCartByID,
  addToCart
} from './lib/cart.js';

import { 
  requireAuthentication,  
} from './auth/passport.js';

export const route = express.Router();

route.post('/cart', async (req, res) => {
  const cart = await createCart();
  if (cart) {
    return res.json({ cart });
  }
  return res.json({ error: "Failed to create cart" });
});