const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");

// Route to add a role
router.post("/add-role", roleController.addRole);

module.exports = router;
