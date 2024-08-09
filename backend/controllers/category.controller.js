const { Category } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function addCategory(req, res) {
  var { category_name, category_icon, description } = req.body;

  const schema = {
    category_name: { type: "string", min: 3, max: 255 },
    category_icon: { type: "string", min: 3, max: 255 },
    description: { type: "string", min: 3, max: 255 },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  const category_slug = generateSlug(category_name);
  const status = "1";

  Category.findAll({
    where: { category_name: category_name },
  })
    .then(function (category) {
      if (category.length > 0) {
        return res.status(400).send({
          message: "Category already exists",
          errors: [
            {
              field: category_name,
              message: "Category with this name already exists",
            },
          ],
        });
      }

      Category.create({
        category_name: category_name,
        category_slug: category_slug,
        category_icon: category_icon,
        description: description,
        status: status,
      })
        .then(function (category) {
          res.status(201).send({
            message: "Category created successfully",
            category: category,
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error creating category",
            error: error.message,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error creating category",
        error: error.message,
      });
    });
}

async function updateCategory(req, res) {
  const { category_name, category_icon, description } = req.body;
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({ message: "Category ID is required" });
  }

  const schema = {
    category_name: { type: "string", min: 3, max: 255, optional: true },
    category_icon: { type: "string", min: 3, max: 255, optional: true },
    description: { type: "string", min: 3, max: 255, optional: true },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    // Check if the new category_name already exists
    if (category_name) {
      const existingCategory = await Category.findOne({
        where: { category_name },
      });
      if (existingCategory && existingCategory.id !== id) {
        return res
          .status(400)
          .send({ message: "Category name already exists" });
      }
    }

    const category_slug = generateSlug(category_name);

    // Update category fields
    category.category_name = category_name;
    category.category_slug = category_slug;
    category.category_icon = category_icon;
    category.description = description;

    await category.save();
    res.status(200).send({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
}

async function deleteCategory(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({ message: "Category ID is required" });
  }

  const result = await Category.deleteCategory(id);
  if (result) {
    return res.status(200).send({ message: "Category deleted successfully" });
  } else {
    return res.status(404).send({ message: "Category not found" });
  }
}

async function changeStatus(req, res) {
  const id = req.params.id;
  const status = req.body.status;

  if (!id) {
    return res.status(400).send({ message: "Category ID is required" });
  }

  if (status === undefined) {
    return res.status(400).send({ message: "Status is required" });
  }

  const result = await Category.changeStatus(id, status);
  if (result) {
    return res.status(200).send({ message: "Category status updated" });
  } else {
    return res.status(404).send({ message: "Category not found" });
  }
}

module.exports = {
  addCategory: addCategory,
  updateCategory: updateCategory,
  deleteCategory: deleteCategory,
  changeStatus: changeStatus,
};
