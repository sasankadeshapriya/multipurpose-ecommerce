'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [{
      category_name: 'Uncategorized',
      category_slug: 'uncategorized',
      category_icon: 'coffee',
      description: 'This is a default category for items that do not fit into any specific category.',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', { category_slug: 'uncategorized' }, {});
  }
};
