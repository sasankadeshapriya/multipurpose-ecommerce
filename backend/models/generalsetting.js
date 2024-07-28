'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeneralSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GeneralSetting.init({
    title: DataTypes.STRING,
    logo: DataTypes.STRING,
    favicon: DataTypes.STRING,
    meta_description: DataTypes.TEXT,
    meta_keywords: DataTypes.TEXT,
    meta_author: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GeneralSetting',
  });
  return GeneralSetting;
};