const bcrypt = require("bcrypt");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const sendEmail = require("../utils/email");

const v = new validator();

function userSignup(req, res) {
  const { name, email, password, confirm_password } = req.body;

  // Validate request
  const schema = {
    name: { type: "string", min: 3, max: 255 },
    email: { type: "email", max: 255 },
    password: { type: "string", min: 6, max: 255 },
    confirm_password: { type: "equal", field: "password" },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  User.findAll({
    where: { email: email },
  })
    .then(function (user) {
      if (user.length > 0) {
        return res.status(400).send({
          message: "User already exists",
          errors: [
            { field: email, message: "User with this email already exists" },
          ],
        });
      }

      // Hash password
      var salt = bcrypt.genSaltSync(10);
      var hashedPassword = bcrypt.hashSync(password, salt);

      // Create new user
      User.create({
        name: name,
        email: email,
        password: hashedPassword,
        is_admin: false,
        status: true,
      })
        .then(async function (user) {
          // Send email
          await sendEmail({
            to: user.email,
            subject: "Welcome to our app",
            text: "Welcome to our app",
          });

          return res.status(201).send({
            message: "User created successfully",
            user: user,
          });
        })
        .catch(function (error) {
          return res.status(500).send({
            message: "Internal server error",
            error: error,
          });
        });
    })
    .catch(function (error) {
      return res.status(500).send({
        message: "Internal server error",
        error: error,
      });
    });
}

function userSignin(req, res) {
  const { email, password } = req.body;

  // Validate request
  const schema = {
    email: { type: "email", max: 255 },
    password: { type: "string", min: 6, max: 255 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  User.findOne({
    where: { email: email },
  })
    .then(function (user) {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
          errors: [{ field: email, message: "User not found" }],
        });
      }

      // Check if password is correct
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({
          message: "Invalid password",
          errors: [{ field: "password", message: "Invalid password" }],
        });
      }

      // Generate token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          status: user.status
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Set the token in an HTTP-only cookie
      res.cookie("userAuthToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: process.env.COOKIE_EXPIRE,
      });

      return res.status(200).send({
        message: "User signed in successfully",
      });
    })
    .catch(function (error) {
      return res.status(500).send({
        message: "Internal server error",
        error: error,
      });
    });
}

function userSignout(req, res) {
  req.logout(function (err) {
    if (err) {
      return res.status(500).send({
        message: "Failed to log out user",
        error: err,
      });
    }

    req.session.destroy(function (err) {
      if (err) {
        return res.status(500).send({
          message: "Failed to destroy the session",
          error: err,
        });
      }

      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.clearCookie("userAuthToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      return res.status(200).send({
        message: "User signed out successfully",
      });
    });
  });
}

function changeStatus(req, res) {
  const { email, status } = req.body;

  // Validate request
  const schema = {
    email: { type: "email", max: 255 },
    status: { type: "boolean" },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  User.findOne({
    where: { email: email },
  })
    .then(function (user) {
      if (!user) {
        return res.status(404).send({
          message: "User not found",
          errors: [{ field: email, message: "User not found" }],
        });
      }

      user
        .update({ status: status })
        .then(function () {
          res.status(200).send({
            message: "Status updated successfully",
            status: user.status,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Server error updating status",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      return res.status(500).send({
        message: "Server error fetching user",
        error: error.message,
      });
    });
}

module.exports = {
  userSignup: userSignup,
  userSignin: userSignin,
  userSignout: userSignout,
  changeStatus:changeStatus
};
