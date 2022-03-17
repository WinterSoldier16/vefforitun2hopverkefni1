import express from 'express';

import {
  createCart,
  getCartByID,
  addToCart,
  deleteCart,
  findProductInCart,
} from './lib/cart.js';

import { 
  requireAuthentication,  
} from './auth/passport.js';

export const route = express.Router();

route.post('/cart', async (req, res) => {
  const cartID = await createCart();
  console.log(cartID);
  if (cartID) {
    return res.json({ cartID });
  }
  return res.json({ error: "Failed to create cart" });
});

route.get('/cart/:cartid', async (req, res) => {
  const { cartid } = req.params;
  const cart = await getCartByID(cartid);
  if (cart) {
    return res.json({ cart });
  }
  return res.json({ error: "Failed to find cart by ID" });
});

route.post('/cart/:cartid', async (req, res) => {
  const { cartid } = req.params;
  const { idvara, fjoldivara = ''} = req.body;
  console.log("idVoru: " + idvara);
  const cart = await addToCart(idvara, cartid, fjoldivara);
  if (cart) {
    return res.json({ cart });
  }
  return res.json({ error: "Failed to add to cart" });
});

route.delete('/cart/:cartid', async (req, res) => {
  const { cartid } = req.params;
  const del = await deleteCart(cartid);
  if (del) {
    return res.json({ del });
  }
  return res.json({ error: "Failed to delete cart" });
});

route.get('/cart/:cartid/line/:id', async (req, res) => {
  const { cartid, id } = req.params;
  const line = await findProductInCart(cartid, id);
  if (line) {
    return res.json({ line });
  }
  return res.json({ error: "Failed to find line in cart" });
});
