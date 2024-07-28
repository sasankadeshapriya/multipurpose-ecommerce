'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FooterInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FooterInformation.init({
    logo: DataTypes.STRING,
    street_address: DataTypes.TEXT,
    contact: DataTypes.TEXT,
    email: DataTypes.TEXT,
    news_letter: DataTypes.TEXT,
    accepts: DataTypes.TEXT,
    design_developed: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FooterInformation',
  });
  return FooterInformation;
};