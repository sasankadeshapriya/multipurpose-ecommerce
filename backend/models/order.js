'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User);
    }
  }
  Order.init({
    order_number: DataTypes.STRING,
    user_id: DataTypes.BIGINT,
    billing_id: DataTypes.BIGINT,
    shipping_id: DataTypes.BIGINT,
    billing_address: DataTypes.TEXT,
    shipping_address: DataTypes.TEXT,
    coupon_id: DataTypes.BIGINT,
    coupon_amount: DataTypes.DECIMAL,
    delivery_charge: DataTypes.DECIMAL,
    sub_total: DataTypes.DECIMAL,
    tax: DataTypes.DECIMAL,
    grand_total: DataTypes.DECIMAL,
    is_free_delivery: DataTypes.TINYINT,
    is_order_successful: DataTypes.TINYINT,
    is_order_completed: DataTypes.TINYINT,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.TINYINT,
    order_status: DataTypes.TINYINT,
    txn: DataTypes.STRING,
    delivery_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};