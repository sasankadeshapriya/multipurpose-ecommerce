const Validator = require('fastest-validator');
const { Billing, User } = require('../models'); // Adjust the path to your models

const v = new Validator();

const billingSchema = {
    user_id: { type: "number", integer: true },
    name: { type: "string", min: 3, max: 255 },
    email: { type: "email", optional: true },
    street: { type: "string", min: 3, max: 255 },
    state: { type: "string", min: 2, max: 100 },
    zipcode: { type: "string", min: 3, max: 20 },
    country: { type: "string", min: 2, max: 100 },
};
  

// Add a new billing address
const addBilling = async (req, res) => {
  try {
    const { user_id, name, email, street, state, zipcode, country } = req.body;

    // Validate input data
    const validationResult = v.validate({ user_id, name, email, street, state, zipcode, country }, billingSchema);
    if (validationResult !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResult,
      });
    }

    // Create a new billing address
    const billing = await Billing.create({ user_id, name, email, street, state, zipcode, country });

    res.status(201).json({
      success: true,
      message: "Billing address added successfully.",
      billing,
    });
  } catch (error) {
    console.error("Error adding billing address:", error);
    res.status(500).json({
      success: false,
      message: "Error adding billing address.",
      error: error.message,
    });
  }
};

// Edit an existing billing address
const editBilling = async (req, res) => {
  try {
    const { id } = req.params; // Billing ID
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

    // Find the billing address by ID
    const billing = await Billing.findByPk(id);
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: `Billing address with ID ${id} not found.`,
      });
    }

    // Update the billing address with only the provided fields
    const updatedFields = { name, email, street, state, zipcode, country };
    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

    await billing.update(updatedFields);

    res.status(200).json({
      success: true,
      message: "Billing address updated successfully.",
      billing,
    });
  } catch (error) {
    console.error("Error updating billing address:", error);
    res.status(500).json({
      success: false,
      message: "Error updating billing address.",
      error: error.message,
    });
  }
};

// Delete a billing address
const deleteBilling = async (req, res) => {
  try {
    const { id } = req.params;

    const billing = await Billing.findByPk(id);
    if (!billing) {
      return res.status(404).json({
        success: false,
        message: `Billing address with ID ${id} not found.`,
      });
    }

    await billing.destroy();

    res.status(200).json({
      success: true,
      message: "Billing address deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting billing address:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting billing address.",
      error: error.message,
    });
  }
};

// Get a single billing address by ID
const getBillingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the billing address by ID
    const billing = await Billing.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // Include the required User fields
          as: 'User', // Alias matching the association
          foreignKey: 'user_id', // Explicitly define the foreign key
        },
      ],
    });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: `Billing address with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Billing address retrieved successfully.",
      billing,
    });
  } catch (error) {
    console.error("Error retrieving billing address:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving billing address.",
      error: error.message,
    });
  }
};

// Get all billing addresses for a user
const getAllBillingForUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${user_id} not found.`,
      });
    }

    const billingAddresses = await Billing.findAll({
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
      message: "Billing addresses retrieved successfully.",
      billingAddresses,
    });
  } catch (error) {
    console.error("Error retrieving billing addresses:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving billing addresses.",
      error: error.message,
    });
  }
};

module.exports = {
  addBilling,
  editBilling,
  deleteBilling,
  getBillingById,
  getAllBillingForUser,
};
