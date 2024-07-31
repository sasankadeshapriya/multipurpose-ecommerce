var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin.controller');

// Route to add an admin
router.post('/register-admin', adminController.addAdmin);
router.patch('/change-password', adminController.changeAdminPassword);

module.exports = router;


