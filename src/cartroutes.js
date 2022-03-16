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

route.get('/cart/:cartid', async (req, res) => {
  const { cartID } = req.params;
  const cart = await getCartByID(cartID);
  if (cart) {
    return res.json({ cart });
  }
  return res.json({ error: "Failed to find cart by ID" });
});

route.post('/cart/:cartid', async (req, res) => {
  const { cartID } = req.params;
  const { voruID, fjoldiVoru } = req.body;
  const cart = await addToCart(voruID, cartID, fjoldiVoru);
  if (cart) {
    return res.json({ cart });
  }
  return res.json({ error: "Failed to add to cart" });
});

route.delete('/cart/:cartid', async (req, res) => {
  const { cartID } = req.params;
  const del = await deleteCart(cartID);
  if (del) {
    return res.json({ del });
  }
  return res.json({ error: "Failed to delete cart" });
});