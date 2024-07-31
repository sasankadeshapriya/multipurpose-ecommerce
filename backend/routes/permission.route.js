var express = require('express');
var router = express.Router();
var permissionController = require('../controllers/permission.controller')

// Route to add a permission
router.post('/add-permission', permissionController.addPermission);

module.exports = router;


