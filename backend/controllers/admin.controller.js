var bcrypt = require("bcrypt");
var validator = require("fastest-validator");
var { User, Role, Permission, UserPermissions } = require("../models");
const { where } = require("sequelize");
const sendEmail = require('../utils/email');

const v = new validator();

function addAdmin(req, res) {
  var { name, email, password, roles } = req.body;

  // Validate request
  const schema = {
    name: { type: 'string', min: 3, max: 255 },
    email: { type: 'email', max: 255 },
    password: { type: 'string', min: 6, max: 255 },
    roles: { type: 'array', items: 'string', min: 1 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: 'Validation failed',
      errors: check,
    });
  }

  User.findAll({
    where: { email: email },
  })
    .then(function (user) {
      if (user.length > 0) {
        return res.status(400).send({
          message: 'User already exists',
          errors: [
            { field: email, message: 'User with this email already exists' },
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
          }).then(async function (roleInstances) {
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
              subject: 'Admin Account Created',
              text: `Hello ${name},\n\nYou are now an admin on ${siteName}.\n\nYou have been assigned the following roles: ${roles.join(', ')}.\nYour permissions include: ${permissionNames.join(', ')}.\n\nBest regards,\nYour Company`,
              html: `<p>Hello ${name},</p><p>You are now an admin on ${siteName}.</p><p>You have been assigned the following roles: ${roles.join(', ')}.</p><p>Your permissions include: ${permissionNames.join(', ')}.</p><p>Best regards,<br>Your Company</p>`,
            });

            res.status(201).send({
              message: 'Admin and permissions created successfully!',
              user: user,
            });
          }).catch(function (error) {
            res.status(500).send({
              message: 'Error assigning roles to admin',
              error: error.message,
            });
          });
        })
        .catch(function (error) {
          res.status(500).send({ message: 'Server error', error: error.message });
        });
    })
    .catch(function (error) {
      return res.status(500).send({
        message: 'Server error',
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

      // Check if password is correct
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
        .then(function () {
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

module.exports = {
  addAdmin: addAdmin,
  changeAdminPassword: changeAdminPassword,
};
