const express = require('express');
const router = express.Router(); 
const { createCheckoutSession, createBulkCheckout } = require('../controllers/paymentController');
const { protectRoute } = require('../middleware/Auth_Middleware');

router.post('/create-checkout-session', protectRoute, createCheckoutSession);
router.post('/create-checkout-session-bulk', protectRoute, createBulkCheckout);

module.exports = router;
