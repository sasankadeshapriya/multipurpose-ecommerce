'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      small_image: {
        type: Sequelize.STRING
      },
      big_image: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      description_one: {
        type: Sequelize.TEXT
      },
      description_two: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('Blogs');
  }
};