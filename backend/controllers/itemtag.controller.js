const { ItemTag } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function addItemTag(req, res) {
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

  ItemTag.findAll({
    where: { name: name },
  })
    .then(function (itemtag) {
      if (itemtag.length > 0) {
        return res.status(400).send({
          message: "ItemTag already exists",
          errors: [
            {
              field: name,
              message: "ItemTag with this name already exists",
            },
          ],
        });
      }
      ItemTag.create({ name: name })
        .then(function (itemtag) {
          res.status(201).send({
            message: "ItemTag created successfully!",
            itemtag: itemtag,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error creating ItemTag",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error creating ItemTag",
        error: error.message,
      });
    });
}

function updateItemTag(req, res) {
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

  ItemTag.update({ name: name }, { where: { id: id } })
    .then(function (itemtag) {
      if (itemtag == 1) {
        res.status(200).send({
          message: "ItemTag updated successfully!",
        });
      } else {
        res.status(400).send({
          message: "Error updating ItemTag",
        });
      }
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error updating ItemTag",
        error: error.message,
      });
    });
}

function deleteItemTag(req, res) {
  const id = req.params.id;

  ItemTag.findAll({
    where: { id: id },
  })
    .then(function (itemtag) {
      if (itemtag.length === 0) {
        return res.status(404).send({
          message: "ItemTag not found",
          errors: [
            {
              field: "id",
              message: "ItemTag with this id not found",
            },
          ],
        });
      }
      ItemTag.destroy({ where: { id: id } })
        .then(function (itemtag) {
          res.status(200).send({
            message: "ItemTag deleted successfully!",
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error deleting ItemTag",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error deleting ItemTag",
        error: error.message,
      });
    });
}

module.exports = {
  addItemTag: addItemTag,
  updateItemTag: updateItemTag,
  deleteItemTag: deleteItemTag,
};
