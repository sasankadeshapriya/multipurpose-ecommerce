const { Role, Permission } = require("../models");
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

module.exports = {
  addRole: addRole,
};
