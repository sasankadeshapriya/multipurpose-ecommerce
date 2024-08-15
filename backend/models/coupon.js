"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async deleteCoupon(id) {
      const coupon = await Coupon.findByPk(id);
      if (!coupon) {
        return { status: 404, message: "Coupon not found" };
      }
      await coupon.destroy();
      return { status: 200, message: "Coupon deleted successfully" };
    }
  }
  Coupon.init(
    {
      coupon_code: DataTypes.STRING,
      amount: DataTypes.DOUBLE,
      min_expenses: DataTypes.DOUBLE,
      expire_date: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Coupon",
      paranoid: true,
    }
  );
  return Coupon;
};
