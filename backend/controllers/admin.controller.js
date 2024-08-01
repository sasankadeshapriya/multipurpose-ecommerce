const bcrypt = require("bcrypt");
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const {
  User,
  Role,
  Permission,
  UserPermissions,
  UserRoles,
} = require("../models");

const sendEmail = require("../utils/email");

const v = new validator();

function addAdmin(req, res) {
  var { name, email, password, roles } = req.body;

  // Validate request
  const schema = {
    name: { type: "string", min: 3, max: 255 },
    email: { type: "email", max: 255 },
    password: { type: "string", min: 6, max: 255 },
    roles: { type: "array", items: "string", min: 1 },
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
        is_admin: true,
      })
        .then(async function (user) {
          // Find roles
          Role.findAll({
            where: { name: roles },
            include: [Permission], // Include permissions related to these roles
          })
            .then(async function (roleInstances) {
              // Add roles to the user
              await user.addRoles(roleInstances);

              // Extract permissions from roles
              var permissionsToAdd = [];
              var permissionNames = [];
              roleInstances.forEach((role) => {
                role.Permissions.forEach((permission) => {
                  permissionsToAdd.push({
                    UserId: user.id,
                    PermissionId: permission.id,
                  });
                  permissionNames.push(permission.name);
                });
              });

              // Bulk create user permissions
              await UserPermissions.bulkCreate(permissionsToAdd);

              // Extract domain name from email
              const siteName = process.env.SITE_NAME;

              // Send email notification
              await sendEmail({
                to: email,
                subject: "Admin Account Created",
                text: `Hello ${name},\n\nYou are now an admin on ${siteName}.\n\nYou have been assigned the following roles: ${roles.join(
                  ", "
                )}.\nYour permissions include: ${permissionNames.join(
                  ", "
                )}.\n\nBest regards,\nYour Company`,
                html: `<p>Hello ${name},</p><p>You are now an admin on ${siteName}.</p><p>You have been assigned the following roles: ${roles.join(
                  ", "
                )}.</p><p>Your permissions include: ${permissionNames.join(
                  ", "
                )}.</p><p>Best regards,<br>Your Company</p>`,
              });

              res.status(201).send({
                message: "Admin and permissions created successfully!",
                user: user,
              });
            })
            .catch(function (error) {
              res.status(500).send({
                message: "Error assigning roles to admin",
                error: error.message,
              });
            });
        })
        .catch(function (error) {
          res
            .status(500)
            .send({ message: "Server error", error: error.message });
        });
    })
    .catch(function (error) {
      return res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function changeAdminPassword(req, res) {
  var { email, oldPassword, newPassword } = req.body;

  // Validate request
  const schema = {
    email: { type: "email", max: 255 },
    oldPassword: { type: "string", min: 6, max: 255 },
    newPassword: { type: "string", min: 6, max: 255 },
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

      // Check if old password is correct
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).send({
          message: "Invalid password",
          errors: [{ field: "password", message: "Invalid password" }],
        });
      }

      // Check if new password is the same as old password
      if (bcrypt.compareSync(newPassword, user.password)) {
        return res.status(400).send({
          message: "New password cannot be the same as old password",
          errors: [
            {
              field: "newPassword",
              message: "New password cannot be the same as old password",
            },
          ],
        });
      }

      // Hash new password
      var salt = bcrypt.genSaltSync(10);
      var hashedPassword = bcrypt.hashSync(newPassword, salt);

      // Update user password
      user
        .update({ password: hashedPassword })
        .then(async function () {
          // Send email notification
          await sendEmail({
            to: email,
            subject: "Password Changed Successfully",
            text: `Hello,\n\nYour password has been changed successfully.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nYour Company`,
            html: `<p>Hello,</p><p>Your password has been changed successfully.</p><p>If you did not request this change, please contact support immediately.</p><p>Best regards,<br>Your Company</p>`,
          });

          res.status(200).send({
            message: "Password changed successfully",
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Server error",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      return res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function adminLogin(req, res) {
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
    where: { email: email, is_admin: true },
    include: [
      {
        model: Role,
        attributes: ["id", "name"], // Fetch role id and name
        through: { attributes: [] }, // Exclude junction table attributes
      },
      {
        model: Permission,
        attributes: ["id", "name"], // Fetch permission id and name
        through: { attributes: [] }, // Exclude junction table attributes
      },
    ],
  })
    .then(async function (user) {
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

      // Extract roles and permissions with names
      const roles = user.Roles.map((role) => ({
        id: role.id,
        name: role.name,
      }));

      const permissions = user.Permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
      }));

      // Create JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          roles: roles,
          permissions: permissions,
          name: user.name,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Set the token in an HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: process.env.COOKIE_EXPIRE,
      });

      res.status(200).send({
        message: "Login successful",
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
  addAdmin: addAdmin,
  changeAdminPassword: changeAdminPassword,
  adminLogin: adminLogin,
};
