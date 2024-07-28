'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderDetail.init({
    order_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
    product_name: DataTypes.STRING,
    image: DataTypes.STRING,
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    quantity: DataTypes.DECIMAL,
    total_price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};