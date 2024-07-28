'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Page.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    slug: DataTypes.TEXT,
    meta_description: DataTypes.STRING,
    meta_keywords: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Page',
  });
  return Page;
};