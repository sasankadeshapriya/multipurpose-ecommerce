const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");

// Route to add a permission
router.post("/add-permission", permissionController.addPermission);

module.exports = router;
