'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_number: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      billing_id: {
        type: Sequelize.BIGINT
      },
      shipping_id: {
        type: Sequelize.BIGINT
      },
      billing_address: {
        type: Sequelize.TEXT
      },
      shipping_address: {
        type: Sequelize.TEXT
      },
      coupon_id: {
        type: Sequelize.BIGINT
      },
      coupon_amount: {
        type: Sequelize.DECIMAL
      },
      delivery_charge: {
        type: Sequelize.DECIMAL
      },
      sub_total: {
        type: Sequelize.DECIMAL
      },
      tax: {
        type: Sequelize.DECIMAL
      },
      grand_total: {
        type: Sequelize.DECIMAL
      },
      is_free_delivery: {
        type: Sequelize.TINYINT
      },
      is_order_successful: {
        type: Sequelize.TINYINT
      },
      is_order_completed: {
        type: Sequelize.TINYINT
      },
      payment_method: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.TINYINT
      },
      order_status: {
        type: Sequelize.TINYINT
      },
      txn: {
        type: Sequelize.STRING
      },
      delivery_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};