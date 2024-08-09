"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: "category_id",
      });
    }

    static async deleteCategory(id, transaction) {
      try {
        // Find the 'Uncategorized' category to reassign products to
        const uncategorized = await Category.findOne({
          where: { category_slug: 'uncategorized' },
          transaction
        });
        if (!uncategorized) {
          console.error("Uncategorized category not found");
          return false; // If no uncategorized category is found, return false
        }
    
        // Find and check if the category exists
        const category = await Category.findByPk(id, { transaction });
        if (category) {
          // Update the category_id for all products linked to this category
          await sequelize.models.Product.update(
            { category_id: uncategorized.id },
            { where: { category_id: id }, transaction }
          );
    
          // Delete the category if it's not the uncategorized one
          if (id !== uncategorized.id) {
            await category.destroy({ transaction });
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error in deleting category and updating products:", error);
        return false;
      }
    }

    static async changeStatus(id, status) {
      try {
        const category = await Category.findByPk(id);
        if (category) {
          category.status = status;
          await category.save();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error changing category status:", error);
        return false;
      }
    }
  }
  Category.init(
    {
      category_name: DataTypes.STRING,
      category_slug: DataTypes.STRING,
      category_icon: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Category",
      paranoid: true,
    }
  );
  return Category;
};
