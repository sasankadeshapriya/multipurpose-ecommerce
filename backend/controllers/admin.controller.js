const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
const validator = require("fastest-validator");
const jwt = require("jsonwebtoken");
const {
  sequelize,
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

  // Check if roles exist in the database and include permissions
  Role.findAll({
    where: { name: { [Sequelize.Op.in]: roles } },
    include: [{ model: Permission }]
  }).then(roleInstances => {
    if (roleInstances.length !== roles.length) {
      return res.status(404).send({
        message: "One or more roles not found",
      });
    }

    // Proceed with user creation
    User.findOne({
      where: { email: email },
    })
    .then(function (existingUser) {
      if (existingUser) {
        return res.status(400).send({
          message: "User already exists",
          errors: [{ field: 'email', message: "User with this email already exists" }],
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
        status: true,
      })
      .then(async function (newUser) {
        // Add roles to the user
        await newUser.setRoles(roleInstances);

        // Extract permissions from roles
        var permissionsToAdd = [];
        var permissionNames = [];
        roleInstances.forEach((role) => {
          if (role.Permissions) {
            role.Permissions.forEach((permission) => {
              permissionsToAdd.push({
                UserId: newUser.id,
                PermissionId: permission.id,
              });
              permissionNames.push(permission.name);
            });
          }
        });

        // Bulk create user permissions
        await UserPermissions.bulkCreate(permissionsToAdd);

        // Send email notification
        const siteName = process.env.SITE_NAME;
        await sendEmail({
          to: email,
          subject: "Admin Account Created",
          text: `Hello ${name}, you are now an admin on ${siteName}. You have the following roles and permissions.`,
          html: `<p>Hello ${name},</p><p>You are now an admin on ${siteName} with roles: ${roles.join(", ")} and permissions: ${permissionNames.join(", ")}</p>`,
        });

        res.status(201).send({
          message: "Admin and permissions created successfully!",
          user: newUser,
        });
      })
      .catch(function (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Server error", error: error.message });
      });
    })
    .catch(function (error) {
      console.error("Error checking user existence:", error);
      res.status(500).send({ message: "Server error", error: error.message });
    });
  }).catch(error => {
    console.error("Error fetching roles:", error);
    res.status(500).send({
      message: "Server error during role verification",
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
          status: user.status
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

function adminLogout(req, res) {
  // Clear the HTTP-only cookie
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "Strict", 
  });

  res.status(200).send({
    message: "Logout successful",
  });
}

async function editAdmin(req, res) {
  const { email, newName, newEmail, newPassword, newRoles = [] } = req.body;

  const schema = {
    email: { type: "email", max: 255 },
    newName: { type: "string", min: 3, max: 255, optional: true },
    newEmail: { type: "email", max: 255, optional: true },
    newPassword: { type: "string", min: 6, max: 255, optional: true },
    newRoles: { type: "array", items: "string", min: 1, optional: true },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Find the user
    const user = await User.findOne({ where: { email } }, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).send({
        message: "User not found",
        errors: [{ field: email, message: "User not found" }],
      });
    }

    // Check for email uniqueness
    if (newEmail && newEmail !== email) {
      const emailExists = await User.findOne({ where: { email: newEmail } }, { transaction });
      if (emailExists) {
        await transaction.rollback();
        return res.status(400).send({
          message: "Email already exists",
          errors: [{ field: newEmail, message: "Email is already in use" }],
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (newName && newName !== user.name) {
      updateData.name = newName;
    }
    if (newEmail && newEmail !== user.email) {
      updateData.email = newEmail;
    }
    if (newPassword && newPassword !== "") {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(newPassword, salt);
    }

    // Update user information
    await user.update(updateData, { transaction });

    // Get current roles and permissions
    const currentRoles = await user.getRoles({ attributes: ['name'], transaction }) || [];
    const currentRoleNames = currentRoles.map(role => role.name);

    const rolesToAdd = newRoles.filter(role => !currentRoleNames.includes(role));
    const rolesToRemove = currentRoleNames.filter(role => !newRoles.includes(role));

    // Remove roles and permissions
    if (rolesToRemove.length > 0) {
      const rolesToRemoveInstances = await Role.findAll({ where: { name: rolesToRemove }, include: [Permission], transaction }) || [];
      
      // Remove roles
      await user.removeRoles(rolesToRemoveInstances, { transaction });
      
      // Remove permissions
      const permissionsToRemove = rolesToRemoveInstances.flatMap(role => role.Permissions?.map(permission => permission.id) || []);
      if (permissionsToRemove.length > 0) {
        await UserPermissions.destroy({ where: { UserId: user.id, PermissionId: { [Sequelize.Op.in]: permissionsToRemove } }, transaction });
      }
    }

    // Add new roles and permissions
    if (rolesToAdd.length > 0) {
      const rolesToAddInstances = await Role.findAll({ where: { name: rolesToAdd }, include: [Permission], transaction }) || [];

      // Add roles
      await user.addRoles(rolesToAddInstances, { transaction });

      // Add permissions
      const permissionsToAdd = rolesToAddInstances.flatMap(role => role.Permissions?.map(permission => ({
        UserId: user.id,
        PermissionId: permission.id,
      })) || []);
      
      if (permissionsToAdd.length > 0) {
        await UserPermissions.bulkCreate(permissionsToAdd, { transaction });
      }
    }

    await transaction.commit();
    res.status(200).send({
      message: "Admin updated successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error Details:", error);
    await transaction.rollback();
    res.status(500).send({
      message: "Server error",
      error: error.message,
    });
  }
}

module.exports = {
  addAdmin: addAdmin,
  changeAdminPassword: changeAdminPassword,
  adminLogin: adminLogin,
  adminLogout: adminLogout,
  editAdmin: editAdmin
};
