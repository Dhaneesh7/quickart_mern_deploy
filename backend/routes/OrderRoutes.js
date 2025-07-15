const express = require('express');
const router = express.Router();
const orders=require('../controllers/orderController');
const { protectRoute } = require('../middleware/Auth_Middleware');
router.get('/confirm', protectRoute, orders.confirmOrder); // Confirm order endpoint
router.get('/:userId',orders.getOrder);
router.post('/:userId',orders.addOrder);
router.delete('/:userId/:orderId', protectRoute,orders.removeFromOrder);
module.exports = router;