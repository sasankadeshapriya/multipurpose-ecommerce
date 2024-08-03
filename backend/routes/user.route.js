const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/user.controller");

router.post("/signup", userController.userSignup);
router.post("/signin", userController.userSignin);
router.post("/signout", userController.userSignout);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
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
    res.redirect("http://localhost:5173/home");
  }
);

router.get(
  "/auth/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/manual-email-entry"); // Redirect to manual email entry if needed
    }
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
    res.redirect("/profile");
  }
);

module.exports = router;
