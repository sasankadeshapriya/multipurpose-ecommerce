var express = require('express');
var router = express.Router();
var passwordController = require('../controllers/password.controller');

router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);

module.exports = router;


