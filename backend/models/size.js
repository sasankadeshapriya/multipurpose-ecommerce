"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Size.belongsToMany(models.Product, {
        through: "SizeProduct",
        as: "products",
        foreignKey: "size_id",
        otherKey: "product_id",
      });

      Size.hasMany(models.ProductVariant, { foreignKey: 'size_id' });
    }

    static async deleteSize(id) {
      const size = await Size.findByPk(id);
      if (!size) {
        return { status: 404, message: "Size not found" };
      }
      await size.destroy();
      return { status: 200, message: "Size deleted successfully" };
    }
  }
  Size.init(
    {
      size: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Size",
      paranoid: true,
      hooks: {
        beforeDestroy: async (size, options) => {
          const { ProductVariant, Product } = sequelize.models;

          // Start a transaction
          const transaction = await sequelize.transaction();
          try {
            // Find all product variants using this size
            const variants = await ProductVariant.findAll({
              where: { size_id: size.id },
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
              where: { size_id: size.id },
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
    }
  );
  return Size;
};
