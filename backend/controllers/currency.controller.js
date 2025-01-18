const { Currency } = require("../models");
const validator = require("fastest-validator");
const { Op } = require("sequelize");

const v = new validator();

function getAllCurrency(req, res) {
  Currency.findAll()
    .then(function (currency) {
      res.status(200).send({
        message: "Currency list",
        currency: currency,
      });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function getCurrencyById(req, res) {
  const id = req.params.id;

  // Validate request
  const schema = {
    id: { type: "string", optional: false },
  };

  const check = v.validate({ id: id }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Currency.findByPk(id)
    .then(function (currency) {
      if (!currency) {
        return res.status(404).send({
          message: "Currency not found",
        });
      }

      res.status(200).send({
        message: "Currency details",
        currency: currency,
      });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function addCurrency(req, res) {
  var { currencyy, iso, symbol, position, convert_from_usd } = req.body;

  // Validate request
  const schema = {
    currencyy: { type: "string", optional: false, max: "100" },
    iso: { type: "string", optional: false, max: "10" },
    symbol: { type: "string", optional: false, max: "5" },
    position: { type: "string", optional: false, max: "10" },
    convert_from_usd: { type: "number", optional: false },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Currency.findAll({
    where: { currency: currencyy },
  })
    .then(function (currency) {
      if (currency.length > 0) {
        return res.status(400).send({
          message: "Currency already exists",
          errors: [
            {
              message: "Currency with this name already exists",
            },
          ],
        });
      }

      Currency.create({
        currency: currencyy,
        iso: iso,
        symbol: symbol,
        position: position,
        convert_from_usd: convert_from_usd,
      })
        .then(function (currency) {
          res.status(201).send({
            message: "Currency created successfully",
            currency: currency,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Server error",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function editCurrency(req, res) {
  const id = req.params.id;
  const { currencyy, iso, symbol, position, convert_from_usd } = req.body;

  const schema = {
    currencyy: { type: "string", optional: false, max: "100" },
    iso: { type: "string", optional: false, max: "10" },
    symbol: { type: "string", optional: false, max: "5" },
    position: { type: "string", optional: false, max: "10" },
    convert_from_usd: { type: "number", optional: false },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // Chcek if currency exists and name already taken
  Currency.findAll({
    where: {
      currency: currencyy,
      id: { [Op.ne]: id },
    },
  })
    .then(function (currency) {
      if (currency.length > 0) {
        return res.status(400).send({
          message: "Currency already exists",
          errors: [
            {
              message: "Currency with this name already exists",
            },
          ],
        });
      }

      Currency.findByPk(id)
        .then(function (currency) {
          if (!currency) {
            return res.status(404).send({
              message: "Currency not found",
            });
          }

          currency.currency = currencyy;
          currency.iso = iso;
          currency.symbol = symbol;
          currency.position = position;
          currency.convert_from_usd = convert_from_usd;

          currency
            .save()
            .then(function (currency) {
              res.status(200).send({
                message: "Currency updated successfully",
                currency: currency,
              });
            })
            .catch(function (error) {
              res.status(500).send({
                message: "Server error",
                error: error.message,
              });
            });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Server error",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

function deleteCurrency(req, res) {
  const id = req.params.id;

  Currency.findByPk(id)
    .then(function (currency) {
      if (!currency) {
        return res.status(404).send({
          message: "Currency not found",
        });
      }

      currency
        .destroy()
        .then(function () {
          res.status(200).send({
            message: "Currency deleted successfully",
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Server error",
            error: error.message,
          });
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
  getAllCurrency: getAllCurrency,
  getCurrencyById: getCurrencyById,
  addCurrency: addCurrency,
  editCurrency: editCurrency,
  deleteCurrency: deleteCurrency,
};
