"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand.hasMany(models.Product, {
        foreignKey: "brand_id",
      });
    }

    static async deleteBrand(id) {
      try {
        const brand = await Brand.findByPk(id);
        if (brand) {
          await brand.destroy();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error soft deleting brand:", error);
        return false;
      }
    }
  }
  Brand.init(
    {
      brand_name: DataTypes.STRING,
      brand_slug: DataTypes.STRING,
      brand_image: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand",
      paranoid: true,
    }
  );
  return Brand;
};
