'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Blog); 
      User.hasMany(models.Order);
      User.hasMany(models.ProductReview);
      User.hasMany(models.BlogComment);
      User.hasMany(models.Wishlist);
      User.hasMany(models.CompareList); 
      User.hasMany(models.Shipping);
      User.hasOne(models.Billing);     
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    google_id: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    image: DataTypes.STRING,
    number: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,
    street_address: DataTypes.STRING,
    about: DataTypes.TEXT,
    is_admin: DataTypes.BOOLEAN,
    status: DataTypes.INTEGER,
    email_verified_at: DataTypes.DATE,
    password: DataTypes.STRING,
    remember_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};