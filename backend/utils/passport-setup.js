const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/api/user/auth/google/redirect"
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    try {
      let user = await User.findOne({ where: { email } });
      if (!user) {
        // Create a new user if not found
        user = await User.create({
          name: profile.displayName,
          email,
          google_id: profile.id,
          image: profile.photos[0].value
        });
      } else {
        // Link Google ID if the user already exists
        user.google_id = profile.id;
        await user.save();
      }
      done(null, user);
    } catch (error) {
      console.error("Error in Google Strategy:", error);
      done(error, null);
    }
  }
));


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/api/user/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails ? profile.emails[0].value : null;
    try {
      let user = null;
      if (email) {
        user = await User.findOne({ where: { email } });
      }
      if (!user) {
        // Require email manually if not provided by Facebook
        done(null, null, { message: "Email required" });
      } else {
        // Link Facebook ID if the user already exists
        user.facebook_id = profile.id;
        await user.save();
        done(null, user);
      }
    } catch (error) {
      done(error, null);
    }
  }
));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
