var { Permission } = require("../models");

function addPermission(req, res) {
  var { name, guard_name } = req.body;
  Permission.create({ name: name, guard_name: guard_name })
    .then(function (permission) {
      res
        .status(201)
        .send({
          message: "Permission created successfully!",
          permission: permission,
        });
    })
    .catch(function (error) {
      res.status(500).send({ message: "Server error", error: error.message });
    });
}

module.exports = {
  addPermission: addPermission,
};
