const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/user.controller");

router.post("/signup", userController.userSignup);
router.post("/signin", userController.userSignin);
router.post("/signout", userController.userSignout);
router.patch("/status",userController.changeStatus);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"], // Asking for email permission
  })
);

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/unauthorize`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    res.cookie("userAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: process.env.COOKIE_EXPIRE,
    });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

router.get(
  "/auth/facebook/redirect",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL}/unauthorize`,
  }),
  (req, res) => {
    if (!req.user && req.authInfo && req.authInfo.message === "email_missing") {
      return res.redirect(`${process.env.FRONTEND_URL}/unauthorize`);
    } else if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/unauthorize`);
    }
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    console.log("Token generated:", token);
    res.cookie("userAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: parseInt(process.env.COOKIE_EXPIRE, 10),
    });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

module.exports = router;
