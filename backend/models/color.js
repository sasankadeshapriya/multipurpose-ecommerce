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

      Color.hasMany(models.ProductVariant, { foreignKey: 'color_id' });
    }

  }
  Color.init({
    name: DataTypes.STRING,
    color_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Color',
    paranoid: true,
    hooks: {
      beforeDestroy: async (color, options) => {
        // Delete related entries from ColorProduct table
        await sequelize.models.ColorProduct.destroy({
          where: { color_id: color.id },
          transaction: options.transaction 
        });
      }
    }
  });
  return Color;
};