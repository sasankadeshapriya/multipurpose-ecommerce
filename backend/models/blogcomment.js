'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlogComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BlogComment.init({
    blog_id: DataTypes.BIGINT,
    user_id: DataTypes.BIGINT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    comment: DataTypes.TEXT,
    parent_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BlogComment',
  });
  return BlogComment;
};