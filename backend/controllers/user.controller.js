const bcrypt = require("bcrypt");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const sendEmail = require("../utils/email");

const v = new validator();

function userSignup(req, res) {
  //   {
  //     "name" : "test",
  //     "email" : "test@gmail.com",
  //     "password" : "123456",
  // 		"confirm_password" : "123456"
  // }

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

module.exports = {
  userSignup: userSignup,
};
