'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpecialOffer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SpecialOffer.init({
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    category_id: DataTypes.BIGINT,
    discount: DataTypes.STRING,
    url: DataTypes.STRING,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'SpecialOffer',
  });
  return SpecialOffer;
};