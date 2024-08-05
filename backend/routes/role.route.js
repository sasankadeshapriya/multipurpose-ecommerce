const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");

// Route to add a role
router.post("/add-role", roleController.addRole);
router.patch("/edit-role", roleController.editRole);
router.delete("/delete-role", roleController.deleteRole);

module.exports = router;
