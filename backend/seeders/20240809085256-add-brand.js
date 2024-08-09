'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Brands', [
      {
        brand_name: 'Unbranded',
        brand_slug: 'unbranded',
        brand_image: 'banner.png',
        status: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', { brand_slug: 'unbranded' }, {});
  }
};
