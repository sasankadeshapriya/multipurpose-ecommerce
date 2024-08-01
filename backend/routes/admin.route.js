const express = require('express');
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.post('/register-admin', adminController.addAdmin);
router.patch('/change-password', adminController.changeAdminPassword);
router.post('/login', adminController.adminLogin);
router.post('/logout',adminController.adminLogout);

module.exports = router;


