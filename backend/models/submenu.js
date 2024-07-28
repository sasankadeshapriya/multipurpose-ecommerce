'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubMenu.init({
    name: DataTypes.STRING,
    url: DataTypes.TEXT,
    menu_id: DataTypes.BIGINT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SubMenu',
  });
  return SubMenu;
};