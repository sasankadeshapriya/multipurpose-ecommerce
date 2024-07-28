'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wishlist.belongsTo(models.User);
    }
  }
  Wishlist.init({
    user_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};