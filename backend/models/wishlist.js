"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wishlist.belongsTo(models.User, {
        foreignKey: "user_id", // Ensure this matches the column name in the database
      });

      Wishlist.belongsTo(models.Product, {
        foreignKey: "product_id", // Ensure this matches the column name in the database
      });
    }
  }
  Wishlist.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Wishlist",
      paranoid: true,
    }
  );
  return Wishlist;
};
