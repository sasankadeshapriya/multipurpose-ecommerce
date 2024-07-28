'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryCharge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeliveryCharge.init({
    country: DataTypes.STRING,
    charge: DataTypes.DOUBLE,
    status: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'DeliveryCharge',
  });
  return DeliveryCharge;
};