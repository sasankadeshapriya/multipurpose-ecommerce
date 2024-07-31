var bcrypt = require('bcrypt');
var { User, Role, Permission, UserPermissions } = require('../models');

function addAdmin(req, res) {
    var { name, email, password, roles } = req.body;

    // Hash password
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    // Create new user
    User.create({
        name: name,
        email: email,
        password: hashedPassword,
        is_admin: true
    })
    .then(function(user) {
        // Find roles
        if (roles && roles.length > 0) {
            Role.findAll({
                where: { name: roles },
                include: [Permission] // Include permissions related to these roles
            }).then(function(roleInstances) {
                // Add roles to the user
                user.addRoles(roleInstances).then(function() {
                    // Extract permissions from roles
                    var permissionsToAdd = [];
                    roleInstances.forEach(role => {
                        role.Permissions.forEach(permission => {
                            permissionsToAdd.push({
                                UserId: user.id,
                                PermissionId: permission.id
                            });
                        });
                    });

                    // Bulk create user permissions
                    UserPermissions.bulkCreate(permissionsToAdd)
                    .then(function() {
                        res.status(201).send({ message: 'Admin and permissions created successfully!', user: user });
                    })
                    .catch(function(error) {
                        res.status(500).send({ message: 'Error adding permissions to user', error: error.message });
                    });
                })
                .catch(function(error) {
                    res.status(500).send({ message: 'Error assigning roles to admin', error: error.message });
                });
            });
        } else {
            res.status(201).send({ message: 'Admin created without specific roles!', user: user });
        }
    })
    .catch(function(error) {
        res.status(500).send({ message: 'Server error', error: error.message });
    });
}

module.exports = {
    addAdmin: addAdmin
};
