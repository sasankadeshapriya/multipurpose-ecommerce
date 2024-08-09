const { Color, sequelize } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Validator = require('fastest-validator');

const v = new Validator();
const colorSchema = {
    name: { 
        type: "string", 
        optional: true, 
        min: 3, 
        custom: (value, errors) => {
            if (value && value.trim().length < 3) {
                errors.push({ type: "stringMin", expected: 3, actual: value.trim().length });
            }
            return value ? value.trim() : value;
        }
    },
    color_code: { 
        type: "string", 
        optional: true, 
        pattern: /^#[0-9A-Fa-f]{6}$/, 
        message: "Must be a valid hex color code" 
    }
};

async function addColor(req, res) {
    const { name, color_code } = req.body;

    // Validate input
    const validationResponse = v.validate({ name, color_code }, colorSchema);
    if (Array.isArray(validationResponse) && validationResponse.length) {
        return res.status(400).json({ errors: validationResponse });
    }

    try {
        const trimmedName = name.trim();
        const trimmedColorCode = color_code.trim().toUpperCase();

        const existingColor = await Color.findOne({
            where: sequelize.or(
                { name: trimmedName },
                { color_code: trimmedColorCode }
            )
        });

        if (existingColor) {
            return res.status(409).json({
                message: "Color with the same name or code already exists."
            });
        }

        const newColor = await Color.create({
            name: trimmedName,
            color_code: trimmedColorCode
        });

        return res.status(201).json({
            message: "Color added successfully",
            color: newColor
        });
    } catch (error) {
        console.error("Server error while adding color:", error);
        return res.status(500).json({
            message: "Server error while adding color"
        });
    }
}

async function editColor(req, res) {
    const { id } = req.params;
    const { name, color_code } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (color_code !== undefined) updateData.color_code = color_code.trim().toUpperCase();

    const validationResponse = v.validate(updateData, colorSchema);
    if (Array.isArray(validationResponse) && validationResponse.length) {
        return res.status(400).json({ errors: validationResponse });
    }

    try {
        const existingColor = await Color.findByPk(id);
        if (!existingColor) {
            return res.status(404).json({ message: "Color not found" });
        }

        const conflictConditions = {
            [Op.and]: [{ id: { [Op.ne]: id } }]
        };

        if (name !== undefined) conflictConditions[Op.or] = [{ name: updateData.name }];
        if (color_code !== undefined) {
            if (!conflictConditions[Op.or]) conflictConditions[Op.or] = [];
            conflictConditions[Op.or].push({ color_code: updateData.color_code });
        }

        const conflictColor = await Color.findOne({ where: conflictConditions });

        if (conflictColor) {
            return res.status(409).json({
                message: "Another color with the same name or code already exists."
            });
        }

        Object.assign(existingColor, updateData);
        await existingColor.save();

        return res.status(200).json({
            message: "Color updated successfully",
            color: existingColor
        });
    } catch (error) {
        console.error("Failed to edit color:", error);
        return res.status(500).json({
            message: "Server error while updating color"
        });
    }
}


async function deleteColor(req, res) {
    const { id } = req.params;
  
    try {
      const color = await Color.findByPk(id);
      if (!color) {
        return res.status(404).json({ message: "Color not found." });
      }
  
      // Soft delete the color and related entries in ColorProduct
      await color.destroy();
  
      return res.status(200).json({ message: "Color deleted successfully." });
    } catch (error) {
      console.error("Error deleting color:", error);
      return res.status(500).json({ message: "Server error while deleting color." });
    }
}

module.exports = {
    addColor : addColor,
    editColor : editColor,
    deleteColor : deleteColor
};
