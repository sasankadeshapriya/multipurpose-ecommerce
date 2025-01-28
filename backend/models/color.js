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
        const { ProductVariant, Product } = sequelize.models;

        // Start a transaction
        const transaction = await sequelize.transaction();
        try {
          // Find all product variants using this color
          const variants = await ProductVariant.findAll({
            where: { color_id: color.id },
            transaction,
          });

          // Update product quantities
          for (const variant of variants) {
            const product = await Product.findByPk(variant.product_id, { transaction });
            if (product) {
              product.quantity -= variant.quantity; // Deduct variant quantity from product
              await product.save({ transaction });
            }
          }

          // Delete the related product variants
          await ProductVariant.destroy({
            where: { color_id: color.id },
            transaction,
          });

          // Commit the transaction
          await transaction.commit();
        } catch (error) {
          // Rollback the transaction in case of an error
          await transaction.rollback();
          throw error;
        }
      },
    },
  });
  return Color;
};