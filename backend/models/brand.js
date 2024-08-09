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
      const transaction = await sequelize.transaction();
      try {
        // First, find the 'unbranded' brand ID to use for reassignment
        const unbranded = await Brand.findOne({
          where: { brand_slug: "unbranded" },
          transaction
        });
        if (!unbranded) {
          console.error("Unbranded brand not found");
          await transaction.rollback();
          return false;
        }
    
        // Check if the brand exists before trying to delete
        const brand = await Brand.findByPk(id, { transaction });
        if (!brand) {
          console.error("Brand not found");
          await transaction.rollback();
          return false;
        }
    
        // Update the brand_id of all products linked to this brand
        await sequelize.models.Product.update(
          { brand_id: unbranded.id },
          { where: { brand_id: id }, transaction }
        );
    
        // If the brand to be deleted is not 'unbranded', proceed to delete
        if (id !== unbranded.id) {
          await brand.destroy({ transaction });
        }
    
        // Commit the transaction
        await transaction.commit();
        return true;
      } catch (error) {
        console.error("Error in deleting brand and updating products:", error);
        await transaction.rollback();
        return false;
      }
    }

    static async changeStatus(id, status) {
      try {
        const brand = await Brand.findByPk(id);
        if (brand) {
          brand.status = status;
          await brand.save();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error changing brand status:", error);
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
