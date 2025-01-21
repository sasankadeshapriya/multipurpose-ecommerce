'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductVariant.belongsTo(models.Product, {
        foreignKey: 'product_id',
      });
      ProductVariant.belongsTo(models.Color, {
        foreignKey: 'color_id',
      });
      ProductVariant.belongsTo(models.Size, {
        foreignKey: 'size_id',
      });
    }
  }
  ProductVariant.init({
    product_id: DataTypes.BIGINT,
    color_id: DataTypes.BIGINT,
    size_id: DataTypes.BIGINT,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0, // Ensure quantity is not negative
      },
    },
  }, {
    sequelize,
    modelName: 'ProductVariant',
    paranoid: true,
  });
  return ProductVariant;
};