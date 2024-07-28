'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalAccessToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalAccessToken.init({
    tokenable_type: DataTypes.STRING,
    tokenable_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    token: DataTypes.STRING,
    abilities: DataTypes.TEXT,
    last_used_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PersonalAccessToken',
  });
  return PersonalAccessToken;
};