const express = require("express");
const router = express.Router();
const passport = require('passport');
const userController = require("../controllers/user.controller");

router.post("/signup", userController.userSignup);
router.post("/signin", userController.userSignin);
router.post("/signout", userController.userSignout);

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));
  
  router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/'); 
  });
  
  router.get('/auth/facebook', passport.authenticate('facebook'));
  
  router.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/');
  });

module.exports = router;
