'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipping.belongsTo(models.User);
    }
  }
  Shipping.init({
    user_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    street: DataTypes.STRING,
    state: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shipping',
  });
  return Shipping;
};