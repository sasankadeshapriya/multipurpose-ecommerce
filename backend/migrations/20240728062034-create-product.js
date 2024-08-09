'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.BIGINT
      },
      brand_id: {
        type: Sequelize.BIGINT
      },
      product_name: {
        type: Sequelize.STRING
      },
      product_slug: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.TEXT
      },
      item_tag: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      discount: {
        type: Sequelize.DECIMAL
      },
      discount_price: {
        type: Sequelize.DECIMAL
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      sold: {
        type: Sequelize.DECIMAL
      },
      primary_image: {
        type: Sequelize.STRING
      },
      image2: {
        type: Sequelize.STRING
      },
      image3: {
        type: Sequelize.STRING
      },
      image4: {
        type: Sequelize.STRING
      },
      image5: {
        type: Sequelize.STRING
      },
      digital_type: {
        type: Sequelize.ENUM,
        values: ['file', 'link']
      },
      digital_link: {
        type: Sequelize.TEXT
      },
      digital_file: {
        type: Sequelize.TEXT
      },
      license_name: {
        type: Sequelize.TEXT
      },
      license_key: {
        type: Sequelize.TEXT
      },
      affiliate_link: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.INTEGER
      },
      featured_product: {
        type: Sequelize.BOOLEAN
      },
      best_selling: {
        type: Sequelize.BOOLEAN
      },
      new_arrival: {
        type: Sequelize.BOOLEAN
      },
      on_sale: {
        type: Sequelize.BOOLEAN
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.TEXT
      },
      shipping_return: {
        type: Sequelize.TEXT
      },
      additional_nformation: {
        type: Sequelize.TEXT
      },
      voucher: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};