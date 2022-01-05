const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/get', userController.userAll)
router.get('/post', userController.userRegister);


module.exports = router;