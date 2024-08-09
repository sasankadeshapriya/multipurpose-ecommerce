const { Size } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function addSize(req, res) {
  var { size_name } = req.body;

  const schema = {
    size_name: { type: "string", min: 1, max: 255 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Size.findAll({
    where: { size: size_name },
  })
    .then(function (size) {
      if (size.length > 0) {
        return res.status(400).send({
          message: "Size already exists",
          errors: [
            {
              message: "Size with this name already exists",
            },
          ],
        });
      }

      Size.create({
        size: size_name,
      })
        .then(function (size) {
          res.status(201).send({
            message: "Size created successfully",
            size: size,
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

function updateSize(req, res) {
  const id = req.params.id;
  const { size_name } = req.body;

  const schema = {
    size_name: { type: "string", min: 1, max: 255 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  if (!id) {
    return res.status(400).send({ message: "Size ID is required" });
  }

  Size.findByPk(id)
    .then(function (size) {
      if (!size) {
        return res.status(404).send({ message: "Size not found" });
      }

      let updateFields = {};
      let changesMade = false;

      if (size_name) {
        if (size_name.length < 1) {
          return res
            .status(400)
            .send({ message: "Size name must be at least 2 characters" });
        }
        updateFields.size = size_name;
        changesMade = true;
      }

      if (changesMade) {
        size
          .update(updateFields)
          .then(function () {
            res.status(200).send({
              message: "Size updated successfully",
            });
          })
          .catch(function (error) {
            res.status(500).send({
              message: "Server error",
              error: error.message,
            });
          });
      } else {
        res.status(400).send({
          message: "No changes to save",
        });
      }
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Server error",
        error: error.message,
      });
    });
}

async function deleteSize(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({ message: "Size ID is required" });
  }

  const size = await Size.deleteSize(id);
  if (size.status === 404) {
    return res.status(404).send({ message: "Size not found" });
  } else if (size.status === 200) {
    return res.status(200).send({ message: "Size deleted successfully" });
  } else {
    return res.status(500).send({ message: "Server error" });
  }
}

module.exports = {
  addSize: addSize,
  updateSize: updateSize,
  deleteSize: deleteSize,
};
