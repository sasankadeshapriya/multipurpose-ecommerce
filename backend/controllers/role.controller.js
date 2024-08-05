const { Role, Permission, UserPermissions, RolePermissions, UserRoles, sequelize } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function addRole(req, res) {
  var { name, permissions, guard_name } = req.body;

  // Validate request
  const schema = {
    name: { type: "string", min: 3, max: 255 },
    guard_name: { type: "string", min: 2, max: 255 },
    permissions: { type: "array", items: "string" },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Role.findAll({
    where: { name: name },
  })
    .then(function (role) {
      if (role.length > 0) {
        return res.status(400).send({
          message: "Role already exists",
          errors: [
            { field: name, message: "Role with this name already exists" },
          ],
        });
      }
      Role.create({ name: name, guard_name: guard_name })
        .then(function (role) {
          if (permissions && permissions.length > 0) {
            Permission.findAll({
              where: { name: permissions },
            }).then(function (permissionInstances) {
              role
                .addPermissions(permissionInstances)
                .then(function () {
                  res.status(201).send({
                    message: "Role created successfully!",
                    role: role,
                  });
                })
                .catch(function (error) {
                  res.status(500).send({
                    message: "Error adding permissions to role",
                    error: error.message,
                  });
                });
            });
          } else {
            res.status(201).send({
              message:
                "Role created successfully without specific permissions!",
              role: role,
            });
          }
        })
        .catch(function (error) {
          res
            .status(500)
            .send({ message: "Server error", error: error.message });
        });
    })
    .catch(function (error) {
      res.status(500).send({ message: "Server error", error: error.message });
    });
}

async function editRole(req, res) {
  const { currentName, newName, permissions } = req.body;

  // Validate request
  const schema = {
    currentName: { type: "string", min: 3, max: 255 },
    newName: { type: "string", min: 3, max: 255, optional: true },
    permissions: { type: "array", items: "string", optional: true },
  };

  const check = v.validate(req.body, schema);
  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // Prevent editing Super Admin role
  if (currentName === "Super Admin") {
    return res.status(403).send({
      message: "Modification of 'Super Admin' role is not allowed",
    });
  }

  try {
    const role = await Role.findOne({ where: { name: currentName } });
    if (!role) {
      return res.status(404).send({ message: "Role not found" });
    }

    // Check if permissions exist in the database
    if (permissions) {
      const existingPermissions = await Permission.findAll({
        where: { name: permissions },
      });

      // Validate if all provided permissions are valid
      const foundPermissionNames = existingPermissions.map(p => p.name);
      const invalidPermissions = permissions.filter(p => !foundPermissionNames.includes(p));
      if (invalidPermissions.length > 0) {
        return res.status(400).send({
          message: "Invalid permissions in list",
          invalidPermissions: invalidPermissions,
        });
      }

      const currentPermissions = await role.getPermissions();
      const currentPermissionIds = new Set(currentPermissions.map(p => p.id));
      const newPermissionIds = new Set(existingPermissions.map(p => p.id));

      // Find permissions to add and remove
      const permissionsToAdd = [...newPermissionIds].filter(x => !currentPermissionIds.has(x));
      const permissionsToRemove = [...currentPermissionIds].filter(x => !newPermissionIds.has(x));

      // Update RolePermissions and UserPermissions
      await Promise.all([
        RolePermissions.destroy({ where: { RoleId: role.id, PermissionId: permissionsToRemove } }),
        ...permissionsToAdd.map(permissionId => RolePermissions.create({ RoleId: role.id, PermissionId: permissionId })),
      ]);

      // Update UserPermissions for users who have this role
      const usersWithRole = await UserRoles.findAll({ where: { RoleId: role.id } });
      usersWithRole.forEach(async (userRole) => {
        await UserPermissions.destroy({ where: { UserId: userRole.UserId, PermissionId: permissionsToRemove } });
        permissionsToAdd.forEach(async (permissionId) => {
          await UserPermissions.create({ UserId: userRole.UserId, PermissionId: permissionId });
        });
      });
    }

    // Check if role name is to be updated and ensure it's unique
    if (newName && newName !== currentName) {
      const existingRole = await Role.findOne({ where: { name: newName } });
      if (existingRole) {
        return res.status(400).send({
          message: "A role with the new name already exists",
        });
      }
      role.name = newName;
      await role.save();
    }

    res.status(200).send({
      message: "Role updated successfully",
      role: role,
    });
  } catch (error) {
    res.status(500).send({
      message: "Server error",
      error: error.message,
    });
  }
}

async function deleteRole(req, res) {
  const { roleName } = req.body;

  // Check if the role to be deleted is "Super Admin"
  if (roleName === "Super Admin") {
      return res.status(403).send({ message: "Deleting the 'Super Admin' role is not allowed." });
  }

  const t = await sequelize.transaction(); // Start a new transaction

  try {
      // Find the role by name
      const role = await Role.findOne({ where: { name: roleName } }, { transaction: t });
      if (!role) {
          await t.rollback(); // Rollback the transaction
          return res.status(404).send({ message: "Role not found" });
      }

      // Fetch all related permissions from RolePermissions
      const rolePermissions = await RolePermissions.findAll({ where: { RoleId: role.id } }, { transaction: t });
      const permissionIds = rolePermissions.map(rp => rp.PermissionId);

      // Delete RolePermissions records
      await RolePermissions.destroy({ where: { RoleId: role.id } }, { transaction: t });

      // Fetch all related UserRoles and delete them
      const userRoles = await UserRoles.findAll({ where: { RoleId: role.id } }, { transaction: t });
      await UserRoles.destroy({ where: { RoleId: role.id } }, { transaction: t });

      // Delete related UserPermissions using found permissions
      for (let userId of userRoles.map(ur => ur.UserId)) {
          await UserPermissions.destroy({
              where: {
                  UserId: userId,
                  PermissionId: permissionIds
              }
          }, { transaction: t });
      }

      // Delete the role
      await role.destroy({ transaction: t });

      await t.commit(); // Commit the transaction if all operations succeed
      res.status(200).send({ message: "Role deleted successfully" });
  } catch (error) {
      await t.rollback(); // Rollback the transaction on error
      console.error("Error during role deletion:", error);
      res.status(500).send({ message: "Server error during role deletion", error: error.message });
  }
}

module.exports = {
  addRole: addRole,
  editRole:editRole,
  deleteRole:deleteRole
};
