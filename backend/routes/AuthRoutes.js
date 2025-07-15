const express=require('express');
// import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
const { protectRoute } = require("../middleware/Auth_Middleware.js");
const { signup, login, logout, refreshToken, getProfile ,getUserById} = require("../controllers/authController.js");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token",protectRoute, refreshToken);
router.get("/profile", protectRoute,getProfile);
router.get("/user/:id", protectRoute, getUserById); // Assuming you want to get user profile by ID

module.exports = router;