const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/login', authController.userLogin);
router.post('/forgot', authController.userForgotPassword);
router.post('/signup', authController.userRegister);

module.exports = router;