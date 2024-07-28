'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompareList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CompareList.belongsTo(models.User);
    }
  }
  CompareList.init({
    user_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'CompareList',
  });
  return CompareList;
};