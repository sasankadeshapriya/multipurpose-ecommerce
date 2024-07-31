var express = require('express');
var router = express.Router();
var roleController = require('../controllers/role.controller');

// Route to add a role
router.post('/add-role', roleController.addRole);

module.exports = router;


