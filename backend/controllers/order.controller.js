const { Order } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function getAllOrder(req, res) {
  Order.findAll({
    attributes: [
      "id",
      "order_number",
      "user_id",
      "billing_id",
      "shipping_id",
      "billing_address",
      "shipping_address",
      "coupon_id",
      "coupon_amount",
      "delivery_charge",
      "sub_total",
      "tax",
      "grand_total",
      "is_free_delivery",
      "is_order_successful",
      "is_order_completed",
      "payment_method",
      "payment_status",
      "order_status",
      "txn",
      "delivery_at",
    ],
  })
    .then(function (order) {
      res.status(200).send({
        message: "Order list",
        order: order,
      });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

module.exports = {
  getAllOrder: getAllOrder,
};
