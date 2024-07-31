'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dateNow = new Date();
    await queryInterface.bulkInsert('Permissions', [
      { name: 'category-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'category-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'category-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'category-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'brand-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'brand-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'brand-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'brand-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'product-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'product-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'product-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'product-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'order-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'order-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'order-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'order-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'transaction-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'transaction-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'transaction-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'transaction-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'tax-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'tax-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'tax-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'tax-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'delivery-charge-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'delivery-charge-create', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'delivery-charge-edit', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'delivery-charge-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'currency-list', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow },
      { name: 'advertise-delete', guard_name: 'web', createdAt: dateNow, updatedAt: dateNow }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};
