'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTag extends Model {

    

    static associate(models) {
      // define association here
    }
  }
  ProductTag.init({
    product_id: DataTypes.BIGINT,
    tag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductTag',
  });
  return ProductTag;
};