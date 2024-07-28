'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AboutUsPage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AboutUsPage.init({
    location: DataTypes.STRING,
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    image: DataTypes.STRING,
    icon_one: DataTypes.STRING,
    icon_two: DataTypes.STRING,
    icon_three: DataTypes.STRING,
    icon_four: DataTypes.STRING,
    title_one: DataTypes.STRING,
    title_two: DataTypes.STRING,
    title_three: DataTypes.STRING,
    title_four: DataTypes.STRING,
    description_one: DataTypes.TEXT,
    description_two: DataTypes.TEXT,
    description_three: DataTypes.TEXT,
    description_four: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'AboutUsPage',
  });
  return AboutUsPage;
};