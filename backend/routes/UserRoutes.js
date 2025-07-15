const express = require('express');
const router = express.Router();
const getUsers=require('../controllers/userController')
router.get('/',getUsers.getUsers);
router.post('/',getUsers.insertUsers);
module.exports = router;