const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/signup", userController.userSignup);

module.exports = router;
