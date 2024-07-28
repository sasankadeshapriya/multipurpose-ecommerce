'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Slider.init({
    background_image: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    title: DataTypes.STRING,
    sub_title: DataTypes.STRING,
    description: DataTypes.TEXT,
    button_text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Slider',
  });
  return Slider;
};