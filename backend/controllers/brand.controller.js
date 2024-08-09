const { Brand } = require("../models");
const { Op } = require("sequelize");

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function addBrand(req, res) {
  const { brand_name } = req.body;
  if (!brand_name) {
    return res.status(400).send({ message: "Brand name is required" });
  }

  const brand_image = req.file ? req.file.filename : null;
  if (!brand_image) {
    return res.status(400).send({ message: "Brand image is required" });
  }

  // Check if brand name already exists
  Brand.findOne({
    where: { brand_name: brand_name },
  })
    .then((existingBrand) => {
      if (existingBrand) {
        return res.status(409).send({ message: "Brand name already exists" });
      }

      const brand_slug = generateSlug(brand_name);
      const status = "1"; // Default status as '1'

      Brand.create({
        brand_name: brand_name,
        brand_slug: brand_slug,
        brand_image: brand_image,
        status: status,
      })
        .then((newBrand) => {
          res.status(201).send({
            message: "Brand added successfully",
            brand: newBrand,
          });
        })
        .catch((error) => {
          res
            .status(500)
            .send({ message: "Server error", error: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: "Server error", error: error.message });
    });
}

async function updateBrand(req, res) {
  const id = req.params.id;
  const { brand_name } = req.body;

  if (!id) {
    return res.status(400).send({ message: "Brand ID is required" });
  }

  try {
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).send({ message: "Brand not found" });
    }

    let updateFields = {};
    let changesMade = false;

    if (brand_name) {
      if (brand_name.length < 2) {
        return res
          .status(400)
          .send({ message: "Brand name must be at least 2 characters long" });
      }
      if (brand_name !== brand.brand_name) {
        const nameExists = await Brand.findOne({
          where: { brand_name, id: { [Op.ne]: id } },
        });
        if (nameExists) {
          return res.status(409).send({ message: "Brand name already exists" });
        }

        updateFields.brand_name = brand_name;
        updateFields.brand_slug = generateSlug(brand_name);
        changesMade = true;
      }
    }

    if (req.file) {
      updateFields.brand_image = req.file.filename;
      changesMade = true;
    }

    if (!changesMade) {
      return res
        .status(400)
        .send({ message: "No updates provided or no changes detected" });
    }

    await brand.update(updateFields);
    res.status(200).send({
      message: "Brand updated successfully",
      brand: updateFields,
    });
  } catch (error) {
    console.error("Failed to update brand:", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
}

async function deleteBrand(req, res) {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ message: "Brand ID is required" });
  }

  const result = await Brand.deleteBrand(id);
  if (result) {
    res.status(200).send({ message: "Brand deleted successfully" });
  } else {
    res.status(404).send({ message: "Brand not found" });
  }
}

async function changeStatus(req, res) {
  const id = req.params.id;
  const status = req.body.status;

  if (!id) {
    return res.status(400).send({ message: "Brand ID is required" });
  }

  if (status === undefined) {
    return res.status(400).send({ message: "Status is required" });
  }

  const result = await Brand.changeStatus(id, status);
  if (result) {
    return res.status(200).send({ message: "Brand status updated" });
  } else {
    return res.status(404).send({ message: "Brand not found" });
  }
}

module.exports = {
  addBrand: addBrand,
  updateBrand: updateBrand,
  deleteBrand: deleteBrand,
  changeStatus: changeStatus,
};
