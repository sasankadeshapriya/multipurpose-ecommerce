var { Role, Permission } = require('../models');

function addRole(req, res) {
    var { name, permissions, guard_name } = req.body; 
    Role.create({ name: name, guard_name: guard_name }) 
        .then(function(role) {
            if (permissions && permissions.length > 0) {
                Permission.findAll({
                    where: { name: permissions }
                }).then(function(permissionInstances) {
                    role.addPermissions(permissionInstances)
                        .then(function() {
                            res.status(201).send({ message: 'Role created successfully!', role: role });
                        })
                        .catch(function(error) {
                            res.status(500).send({ message: 'Error adding permissions to role', error: error.message });
                        });
                });
            } else {
                res.status(201).send({ message: 'Role created successfully without specific permissions!', role: role });
            }
        })
        .catch(function(error) {
            res.status(500).send({ message: 'Server error', error: error.message });
        });
}

module.exports = {
    addRole: addRole
};
