const e = require("express");
const { DeliveryCharge } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function getAllDeliveryCharge(req, res) {
  DeliveryCharge.findAll({
    attributes: ["id", "country", "charge", "status"],
  })
    .then(function (deliveryCharge) {
      res.status(200).send({
        message: "Delivery charge list",
        deliveryCharge: deliveryCharge,
      });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function getDeliveryChargeById(req, res) {
  var { id } = req.params;

  const schema = {
    id: { type: "string", positive: true, integer: true },
  };

  const check = v.validate({ id: id }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  DeliveryCharge.findOne({
    where: { id: req.params.id },
    attributes: ["id", "country", "charge", "status"],
  })
    .then(function (deliveryCharge) {
      res.status(200).send({
        message: "Delivery charge",
        deliveryCharge: deliveryCharge,
      });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function addDeliveryCharge(req, res) {
  var { country, charge, status } = req.body;

  const schema = {
    country: { type: "string", optional: false, max: "100" },
    charge: { type: "number", optional: false },
    status: { type: "number", optional: false },
  };

  const check = v.validate({ country, charge, status }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // Check if delivery charge already exists
  DeliveryCharge.findOne({ where: { country: country } }).then(function (
    deliveryCharge
  ) {
    if (deliveryCharge) {
      return res.status(400).send({
        message: "Delivery charge already exists",
      });
    }

    DeliveryCharge.create({ country, charge, status })
      .then(function (deliveryCharge) {
        res.status(200).send({
          message: "Delivery charge added successfully",
          deliveryCharge: deliveryCharge,
        });
      })
      .catch(function (error) {
        res.status(500).send({
          message: "Server error",
          error: error.message,
        });
      });
  });
}

function editDeliveryCharge(req, res) {
  var { country, charge, status } = req.body;
  var { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "Please provide delivery charge id",
      errors: {
        id: "Delivery charge id is required",
      },
    });
  }

  const schema = {
    country: { type: "string", optional: false, max: "100" },
    charge: { type: "number", optional: false },
    status: { type: "number", optional: false },
  };

  const check = v.validate({ country, charge, status }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // check if delivery charge exists
  DeliveryCharge.findOne({ where: { id: id } }).then(function (deliveryCharge) {
    if (!deliveryCharge) {
      return res.status(404).send({
        message: "Delivery charge does not exist",
      });
    }

    DeliveryCharge.update({ country, charge, status }, { where: { id: id } })
      .then(function (deliveryCharge) {
        res.status(200).send({
          message: "Delivery charge updated successfully",
          deliveryCharge: deliveryCharge,
        });
      })
      .catch(function (error) {
        res.status(500).send({
          message: "Server error",
          error: error.message,
        });
      });
  });
}

function deleteDeliveryCharge(req, res) {
  var { id } = req.params;

  if (!id) {
    return res.status(400).send({
      message: "Please provide delivery charge id",
      errors: {
        id: "Delivery charge id is required",
      },
    });
  }

  DeliveryCharge.findOne({ where: { id: id } }).then(function (deliveryCharge) {
    if (!deliveryCharge) {
      return res.status(404).send({
        message: "Delivery charge does not exist",
      });
    }

    DeliveryCharge.destroy({ where: { id: id } })
      .then(function (deliveryCharge) {
        res.status(200).send({
          message: "Delivery charge deleted successfully",
        });
      })
      .catch(function (error) {
        res.status(500).send({
          message: "Server error",
          error: error.message,
        });
      });
  });
}

module.exports = {
  getAllDeliveryCharge: getAllDeliveryCharge,
  getDeliveryChargeById: getDeliveryChargeById,
  addDeliveryCharge: addDeliveryCharge,
  editDeliveryCharge: editDeliveryCharge,
  deleteDeliveryCharge: deleteDeliveryCharge,
};
