const { Coupon } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function addCoupon(req, res) {
  var { coupon_code, amount, min_expenses, expire_date, status } = req.body;

  // Validate request
  const schema = {
    coupon_code: { type: "string", min: 3, max: 255 },
    amount: { type: "number" },
    min_expenses: { type: "number" },
    expire_date: {
      type: "string",
      custom(value, errors) {
        if (isNaN(Date.parse(value))) {
          errors.push({
            type: "date",
            field: "expire_date",
            message: "Invalid date format.",
          });
        }
        return value;
      },
    },
    status: { type: "string" },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Coupon.findAll({
    where: { coupon_code: coupon_code },
  })
    .then(function (coupon) {
      if (coupon.length > 0) {
        return res.status(400).send({
          message: "Coupon already exists",
          errors: [
            {
              field: coupon_code,
              message: "Coupon with this code already exists",
            },
          ],
        });
      }
      Coupon.create({ coupon_code, amount, min_expenses, expire_date, status })
        .then(function (coupon) {
          res.status(201).send({
            message: "Coupon created successfully!",
            coupon: coupon,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error creating Coupon",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error creating Coupon",
        error: error.message,
      });
    });
}

function updateCoupon(req, res) {
  const id = req.params.id;
  var { coupon_code, amount, min_expenses, expire_date, status } = req.body;

  // Validate request
  const schema = {
    coupon_code: { type: "string", min: 3, max: 255 },
    amount: { type: "number" },
    min_expenses: { type: "number" },
    expire_date: {
      type: "string",
      custom(value, errors) {
        if (isNaN(Date.parse(value))) {
          errors.push({
            type: "date",
            field: "expire_date",
            message: "Invalid date format.",
          });
        }
        return value;
      },
    },
    status: { type: "string" },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Coupon.update(
    { coupon_code, amount, min_expenses, expire_date, status },
    { where: { id: id } }
  )
    .then(function (coupon) {
      if (coupon[0] === 1) {
        res.status(200).send({
          message: "Coupon updated successfully!",
        });
      } else {
        res.status(404).send({
          message: "Coupon not found",
        });
      }
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error updating Coupon",
        error: error.message,
      });
    });
}

async function deleteCoupon(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({ message: "Coupon ID is required" });
  }

  const coupon = await Coupon.deleteCoupon(id);

  if (coupon.status === 404) {
    return res.status(404).send({ message: "Coupon not found" });
  }

  return res.status(200).send({ message: "Coupon deleted successfully" });
}

module.exports = {
  addCoupon: addCoupon,
  updateCoupon: updateCoupon,
  deleteCoupon: deleteCoupon,
};
