const { ProductTagList } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function addProductTagList(req, res) {
  var { name } = req.body;

  // Validate request
  const schema = {
    name: { type: "string", min: 3, max: 255 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  ProductTagList.findAll({
    where: { name: name },
  })
    .then(function (producttaglist) {
      if (producttaglist.length > 0) {
        return res.status(400).send({
          message: "ProductTagList already exists",
          errors: [
            {
              field: name,
              message: "ProductTagList with this name already exists",
            },
          ],
        });
      }
      ProductTagList.create({ name: name })
        .then(function (producttaglist) {
          res.status(201).send({
            message: "ProductTagList created successfully!",
            producttaglist: producttaglist,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error creating ProductTagList",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error creating ProductTagList",
        error: error.message,
      });
    });
}

function updateProductTagList(req, res) {
  const id = req.params.id;
  const { name } = req.body;

  // Validate request
  const schema = {
    name: { type: "string", min: 3, max: 255 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  ProductTagList.findAll({
    where: { id: id },
  })
    .then(function (producttaglist) {
      if (producttaglist.length === 0) {
        return res.status(404).send({
          message: "ProductTagList not found",
          errors: [
            {
              field: "id",
              message: "ProductTagList with this id not found",
            },
          ],
        });
      }
      ProductTagList.update({ name: name }, { where: { id: id } })
        .then(function (producttaglist) {
          res.status(200).send({
            message: "ProductTagList updated successfully!",
            producttaglist: producttaglist,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error updating ProductTagList",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error updating ProductTagList",
        error: error.message,
      });
    });
}

function deleteProductTagList(req, res) {
  const id = req.params.id;

  ProductTagList.findAll({
    where: { id: id },
  })
    .then(function (producttaglist) {
      if (producttaglist.length === 0) {
        return res.status(404).send({
          message: "ProductTagList not found",
          errors: [
            {
              field: "id",
              message: "ProductTagList with this id not found",
            },
          ],
        });
      }
      ProductTagList.destroy({ where: { id: id } })
        .then(function (producttaglist) {
          res.status(200).send({
            message: "ProductTagList deleted successfully!",
            producttaglist: producttaglist,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error deleting ProductTagList",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error deleting ProductTagList",
        error: error.message,
      });
    });
}

module.exports = {
  addProductTagList: addProductTagList,
  updateProductTagList: updateProductTagList,
  deleteProductTagList: deleteProductTagList,
};
