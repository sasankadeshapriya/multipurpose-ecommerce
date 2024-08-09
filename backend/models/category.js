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

    static async deleteCategory(id) {
      try {
        const category = await Category.findByPk(id);
        if (category) {
          await category.destroy();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error soft deleting category:", error);
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
