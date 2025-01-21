"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Brand, {
        foreignKey: "brand_id",
      });
      Product.belongsTo(models.Category, {
        foreignKey: "category_id",
      });
      Product.belongsToMany(models.Size, {
        through: "SizeProduct",
        as: "sizes",
        foreignKey: "product_id",
        otherKey: "size_id",
      });
      Product.belongsToMany(models.Color, {
        through: "ColorProduct",
        as: "colors",
        foreignKey: "product_id",
        otherKey: "color_id",
      });
      Product.hasMany(models.ProductTag, {
        // Add this line
        foreignKey: "product_id",
      });
      Product.hasMany(models.ProductReview, { foreignKey: "product_id" });
      Product.hasMany(models.Wishlist, { foreignKey: "product_id" });
      Product.hasMany(models.ProductVariant, { foreignKey: 'product_id' });
    }
  }
  Product.init(
    {
      category_id: DataTypes.BIGINT,
      brand_id: DataTypes.BIGINT,
      product_name: DataTypes.STRING,
      product_slug: DataTypes.STRING,
      about: DataTypes.TEXT,
      item_tag: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      discount: DataTypes.DECIMAL,
      discount_price: DataTypes.DECIMAL,
      quantity: DataTypes.INTEGER,
      sold: DataTypes.DECIMAL,
      primary_image: DataTypes.STRING,
      image2: DataTypes.STRING,
      image3: DataTypes.STRING,
      image4: DataTypes.STRING,
      image5: DataTypes.STRING,
      digital_type: DataTypes.ENUM("file", "link"),
      digital_link: DataTypes.TEXT,
      digital_file: DataTypes.TEXT,
      license_name: DataTypes.TEXT,
      license_key: DataTypes.TEXT,
      affiliate_link: DataTypes.TEXT,
      type: DataTypes.INTEGER,
      featured_product: DataTypes.BOOLEAN,
      best_selling: DataTypes.BOOLEAN,
      new_arrival: DataTypes.BOOLEAN,
      on_sale: DataTypes.BOOLEAN,
      status: DataTypes.BOOLEAN,
      description: DataTypes.TEXT,
      shipping_return: DataTypes.TEXT,
      additional_nformation: DataTypes.TEXT,
      voucher: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
      paranoid: true,
    }
  );
  return Product;
};
