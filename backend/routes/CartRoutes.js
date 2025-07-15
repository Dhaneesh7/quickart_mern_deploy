const express = require('express');
const router = express.Router();
const getCarts=require('../controllers/cartController')
router.get('/:userId',getCarts.getCarts);
router.post('/:userId',getCarts.addToCarts);
router.delete('/:userId', getCarts.removeFromCart);
router.delete('/all/:userId',getCarts.removeAllFromCart)
router.put('/:userId/:productId', getCarts.updateQuantity);
module.exports = router;