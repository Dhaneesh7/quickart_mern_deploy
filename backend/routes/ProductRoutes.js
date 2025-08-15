// routes/productRoutes.js
const express = require('express');
const upload = require("../middleware/upload");
const router = express.Router();
const Admin=require('../middleware/Auth_Middleware');
// import { adminRoute,protectRoute } from '../middleware/Auth_Middleware';
// import {getProducts,insertProducts,getProductsByCategory} from "../controllers/productControllers"
const productController =require('../controllers/productController');
router.get('/',productController.getProducts);

// router.get("/category/:category", productControllerByCategory);
router.get('/id/:productId',productController.getProductById);//full card in frontend
router.post('/:userId',upload.single("image"),productController.insertProducts);
router.delete('/:productId', productController.deleteProduct);

router.get('/category/:category',productController.getProductsByCategory)

module.exports = router;