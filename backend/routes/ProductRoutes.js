// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Admin=require('../middleware/Auth_Middleware');
// import { adminRoute,protectRoute } from '../middleware/Auth_Middleware';
// import {getProducts,insertProducts,getProductsByCategory} from "../controllers/productControllers"
const getProducts =require('../controllers/productController');
router.get('/',getProducts.getProducts);

// router.get("/category/:category", getProductsByCategory);
router.get('/id/:productId',getProducts.getProductById);//full card in frontend
router.post('/:userId',getProducts.insertProducts);
router.delete('/:productId', getProducts.deleteProduct);

router.get('/category/:category',getProducts.getProductsByCategory)

module.exports = router;