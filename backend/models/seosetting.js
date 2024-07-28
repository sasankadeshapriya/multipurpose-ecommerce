'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeoSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SeoSetting.init({
    slug: DataTypes.STRING,
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    keywords: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'SeoSetting',
  });
  return SeoSetting;
};