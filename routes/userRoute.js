const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/get', userController.userAll)

module.exports = router;