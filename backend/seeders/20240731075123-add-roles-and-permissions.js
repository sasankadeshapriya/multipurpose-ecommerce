'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const role = await queryInterface.bulkInsert('Roles', [{
      name: 'Super Admin',
      guard_name: 'web',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });  // This might not work as expected in MySQL/MariaDB if returning is not supported

    // Fetching the ID of the newly inserted role
    const insertedRole = await queryInterface.sequelize.query(
      `SELECT id FROM \`Roles\` WHERE name = 'Super Admin' AND guard_name = 'web'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Assuming permissions are already in the database and fetching their IDs
    const permissions = await queryInterface.sequelize.query(
      `SELECT id FROM \`Permissions\``,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create RolePermissions entries
    const rolePermissions = permissions.map(permission => ({
      roleId: insertedRole[0].id,  // Use the ID from the role query
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('RolePermissions', rolePermissions);
  },

  async down (queryInterface, Sequelize) {
    // Remove the role and its permissions associations
    const insertedRole = await queryInterface.sequelize.query(
      `SELECT id FROM \`Roles\` WHERE name = 'Super Admin' AND guard_name = 'web'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkDelete('RolePermissions', { roleId: insertedRole[0].id });
    await queryInterface.bulkDelete('Roles', { name: 'Super Admin', guard_name: 'web' });
  }
};
