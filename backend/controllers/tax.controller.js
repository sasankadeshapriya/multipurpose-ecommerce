const { Taxes } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function getAllTaxes(req, res) {
  Taxes.findAll()
    .then(function (taxes) {
      res.status(200).send(taxes);
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Some error occurred",
        error: error,
      });
    });
}

function getByIdTax(req, res) {
  const id = req.params.id;

  Taxes.findByPk(id)
    .then(function (tax) {
      if (!tax) {
        return res.status(404).send({
          message: "Tax not found",
        });
      }

      res.status(200).send(tax);
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Some error occurred",
        error: error,
      });
    });
}

function addTax(req, res) {
  var { country, percentage, status } = req.body;

  // Validate request
  const schema = {
    country: { type: "string", optional: false, max: "100" },
    percentage: { type: "number", optional: false },
    status: { type: "number", optional: false },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // Check if tax already exists
  Taxes.findOne({
    where: { country: country },
  })
    .then(function (tax) {
      if (tax) {
        return res.status(400).send({
          message: "Tax already exists",
        });
      }

      Taxes.create({ country: country, percentage: percentage, status: status })
        .then(function (tax) {
          res.status(201).send(tax);
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Some error occurred",
            error: error,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Some error occurred",
        error: error,
      });
    });
}

function editTax(req, res) {
  const id = req.params.id;
  var { country, percentage, status } = req.body;

  // Validate request
  const schema = {
    country: { type: "string", optional: false, max: "100" },
    percentage: { type: "number", optional: false },
    status: { type: "number", optional: false },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // check if country already used
  Taxes.findOne({
    where: { country: country },
  })
    .then(function (tax) {
      if (tax && tax.id != id) {
        return res.status(400).send({
          message: "Country already used",
        });
      }

      Taxes.update(
        { country: country, percentage: percentage, status: status },
        { where: { id: id } }
      )
        .then(function (tax) {
          res.status(200).send({
            message: "Tax updated successfully",
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Some error occurred",
            error: error,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Some error occurred",
        error: error,
      });
    });
}

function deleteTax(req, res) {
  const id = req.params.id;

  Taxes.findByPk(id)
    .then(function (tax) {
      if (!tax) {
        return res.status(404).send({
          message: "Tax not found",
        });
      }

      tax
        .destroy()
        .then(function () {
          res.status(200).send({
            message: "Tax deleted successfully",
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error occurred",
            error: error,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error occurred",
        error: error,
      });
    });
}

module.exports = {
  addTax: addTax,
  editTax: editTax,
  deleteTax: deleteTax,
  getAllTaxes: getAllTaxes,
  getByIdTax: getByIdTax,
};
