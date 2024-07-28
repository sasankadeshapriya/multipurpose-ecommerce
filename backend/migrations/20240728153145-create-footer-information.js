'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FooterInformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      logo: {
        type: Sequelize.STRING
      },
      street_address: {
        type: Sequelize.TEXT
      },
      contact: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      news_letter: {
        type: Sequelize.TEXT
      },
      accepts: {
        type: Sequelize.TEXT
      },
      design_developed: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('FooterInformations');
  }
};