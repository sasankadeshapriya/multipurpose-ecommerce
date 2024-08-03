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

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"], // Asking for email permission
  })
);

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

// router.get(
//   "/auth/facebook/redirect",
//   passport.authenticate("facebook", { failureRedirect: "/login" }),
//   (req, res) => {
//     if (!req.user) {
//       console.log("No user object available after Facebook auth."); // Debug: Log failure
//       return res.redirect("/manual-email-entry");
//     }
//     const token = jwt.sign(
//       { userId: req.user.id, email: req.user.email, name: req.user.name },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );
//     console.log("Token generated:", token); // Debug: Log the token
//     res.cookie("userAuthToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: parseInt(process.env.COOKIE_EXPIRE, 10),
//     });
//     res.redirect("http://localhost:5173/home");
//   }
// );

router.get(
  "/auth/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user && req.authInfo && req.authInfo.message === "email_missing") {
      // Directly redirect to an "Unauthorized" page when no email is available
      console.log("No email available after Facebook auth."); // Debug: Log specific case
      return res.redirect("/unauthorized"); // Redirect to a specific unauthorized route
    } else if (!req.user) {
      console.log("General authentication failure."); // Debug: Log general failure
      return res.redirect("/login");
    }

    // If user is authenticated successfully, proceed with token generation and redirection
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    console.log("Token generated:", token); // Debug: Log the token
    res.cookie("userAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: parseInt(process.env.COOKIE_EXPIRE, 10),
    });
    res.redirect("http://localhost:5173/home");
  }
);

module.exports = router;
