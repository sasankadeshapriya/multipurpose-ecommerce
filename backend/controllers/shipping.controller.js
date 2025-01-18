const Validator = require('fastest-validator');
const { Shipping, User } = require('../models'); // Adjust the path to your models

const v = new Validator();

// Validation schema
const shippingSchema = {
  user_id: { type: "number", integer: true },
  name: { type: "string", min: 3, max: 255 },
  email: { type: "email", optional: true },
  street: { type: "string", min: 3, max: 255 },
  state: { type: "string", min: 2, max: 100 },
  zipcode: { type: "string", min: 3, max: 20 },
  country: { type: "string", min: 2, max: 100 },
};

// Add a new shipping address
const addShipping = async (req, res) => {
  try {
    const { user_id, name, email, street, state, zipcode, country } = req.body;

    // Validate input data
    const validationResult = v.validate({ user_id, name, email, street, state, zipcode, country }, shippingSchema);
    if (validationResult !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResult,
      });
    }

    // Create a new shipping address
    const shipping = await Shipping.create({ user_id, name, email, street, state, zipcode, country });

    res.status(201).json({
      success: true,
      message: "Shipping address added successfully.",
      shipping,
    });
  } catch (error) {
    console.error("Error adding shipping address:", error);
    res.status(500).json({
      success: false,
      message: "Error adding shipping address.",
      error: error.message,
    });
  }
};

// Edit an existing shipping address
const editShipping = async (req, res) => {
    try {
      const { id } = req.params; // Shipping ID
      const { name, email, street, state, zipcode, country } = req.body;
  
      // Validate input data (all fields optional for partial update)
      const validationResult = v.validate(
        { name, email, street, state, zipcode, country },
        {
          name: { type: "string", min: 3, max: 255, optional: true },
          email: { type: "email", optional: true },
          street: { type: "string", min: 3, max: 255, optional: true },
          state: { type: "string", min: 2, max: 100, optional: true },
          zipcode: { type: "string", min: 3, max: 20, optional: true },
          country: { type: "string", min: 2, max: 100, optional: true },
        }
      );
      if (validationResult !== true) {
        return res.status(400).json({
          success: false,
          message: "Validation failed.",
          errors: validationResult,
        });
      }
  
      // Find the shipping address by ID
      const shipping = await Shipping.findByPk(id);
      if (!shipping) {
        return res.status(404).json({
          success: false,
          message: `Shipping address with ID ${id} not found.`,
        });
      }
  
      // Update the shipping address with only the provided fields
      const updatedFields = { name, email, street, state, zipcode, country };
      Object.keys(updatedFields).forEach(
        (key) => updatedFields[key] === undefined && delete updatedFields[key]
      );
  
      await shipping.update(updatedFields);
  
      res.status(200).json({
        success: true,
        message: "Shipping address updated successfully.",
        shipping,
      });
    } catch (error) {
      console.error("Error updating shipping address:", error);
      res.status(500).json({
        success: false,
        message: "Error updating shipping address.",
        error: error.message,
      });
    }
  };
  
// Delete a shipping address
const deleteShipping = async (req, res) => {
  try {
    const { id } = req.params;

    const shipping = await Shipping.findByPk(id);
    if (!shipping) {
      return res.status(404).json({
        success: false,
        message: `Shipping address with ID ${id} not found.`,
      });
    }

    await shipping.destroy();

    res.status(200).json({
      success: true,
      message: "Shipping address deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting shipping address:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting shipping address.",
      error: error.message,
    });
  }
};

// Get a single shipping address by ID
const getShippingById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the shipping address by ID
      const shipping = await Shipping.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'], // Include the required User fields
            as: 'User', // Explicit alias matching the model association
            foreignKey: 'user_id', // Explicitly define the foreign key
          },
        ],
      });
  
      if (!shipping) {
        return res.status(404).json({
          success: false,
          message: `Shipping address with ID ${id} not found.`,
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Shipping address retrieved successfully.",
        shipping,
      });
    } catch (error) {
      console.error("Error retrieving shipping address:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving shipping address.",
        error: error.message,
      });
    }
  };
  
// Get all shipping addresses for a user
const getAllShippingForUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${user_id} not found.`,
      });
    }

    const shippingAddresses = await Shipping.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // Include related user data
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Shipping addresses retrieved successfully.",
      shippingAddresses,
    });
  } catch (error) {
    console.error("Error retrieving shipping addresses:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving shipping addresses.",
      error: error.message,
    });
  }
};

module.exports = {
  addShipping,
  editShipping,
  deleteShipping,
  getShippingById,
  getAllShippingForUser,
};
