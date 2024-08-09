'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Color.belongsToMany(models.Product, {
        through: 'ColorProduct',
        as: 'products',
        foreignKey: 'color_id',
        otherKey: 'product_id'
      });
    }
  }
  Color.init({
    name: DataTypes.STRING,
    color_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Color',
  });
  return Color;
};