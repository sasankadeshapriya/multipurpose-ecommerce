'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageGallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ImageGallery.init({
    image: DataTypes.STRING,
    theme: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'ImageGallery',
  });
  return ImageGallery;
};