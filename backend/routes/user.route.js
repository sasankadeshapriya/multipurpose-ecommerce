const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/signup", userController.userSignup);
router.post("/signin", userController.userSignin);
router.post("/signout", userController.userSignout);

module.exports = router;
