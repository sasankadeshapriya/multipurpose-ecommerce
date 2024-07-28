'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FailedJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FailedJob.init({
    uuid: DataTypes.STRING,
    connection: DataTypes.TEXT,
    queue: DataTypes.TEXT,
    payload: DataTypes.TEXT,
    exception: DataTypes.TEXT,
    failed_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FailedJob',
  });
  return FailedJob;
};