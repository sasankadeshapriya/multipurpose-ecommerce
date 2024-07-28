'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Advertise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Advertise.init({
    image_one: DataTypes.STRING,
    image_two: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Advertise',
  });
  return Advertise;
};