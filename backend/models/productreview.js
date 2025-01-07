'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductReview.belongsTo(models.User);
      ProductReview.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }
  ProductReview.init({
    rating: DataTypes.TINYINT,
    feedback: DataTypes.TEXT,
    product_id: DataTypes.BIGINT,
    user_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'ProductReview',
  });
  return ProductReview;
};