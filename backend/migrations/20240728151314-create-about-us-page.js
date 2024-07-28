'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AboutUsPages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      icon_one: {
        type: Sequelize.STRING
      },
      icon_two: {
        type: Sequelize.STRING
      },
      icon_three: {
        type: Sequelize.STRING
      },
      icon_four: {
        type: Sequelize.STRING
      },
      title_one: {
        type: Sequelize.STRING
      },
      title_two: {
        type: Sequelize.STRING
      },
      title_three: {
        type: Sequelize.STRING
      },
      title_four: {
        type: Sequelize.STRING
      },
      description_one: {
        type: Sequelize.TEXT
      },
      description_two: {
        type: Sequelize.TEXT
      },
      description_three: {
        type: Sequelize.TEXT
      },
      description_four: {
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
    await queryInterface.dropTable('AboutUsPages');
  }
};