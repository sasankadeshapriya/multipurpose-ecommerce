const { ProductReview, Product, User } = require('../models');
const Validator = require('fastest-validator');

const v = new Validator();

const reviewSchema = {
  rating: { type: "number", integer: true, min: 1, max: 5, messages: { number: "Rating must be a number between 1 and 5." } },
  feedback: { type: "string", optional: true },
  product_id: { type: "number", integer: true },
  user_id: { type: "number", integer: true },
};

const createReview = async (req, res) => {
  try {
    const { rating, feedback, product_id, user_id } = req.body;

    // Validate input fields
    const validationResult = v.validate({ rating, feedback, product_id, user_id }, reviewSchema);
    if (validationResult !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResult,
      });
    }

    // Check if product_id exists in the database
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${product_id} not found.`,
      });
    }

    const review = await ProductReview.create({ rating, feedback, product_id, user_id });

    res.status(201).json({
      success: true,
      message: 'Review created successfully.',
      review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review.',
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
    try {
      const reviewId = req.params.id;
      console.log('Review ID:', reviewId); // Debugging log
  
      const { rating, feedback } = req.body;
  
      // Find the review by ID
      const review = await ProductReview.findOne({
        where: { id: reviewId },
        attributes: ['id', 'rating', 'feedback', 'product_id', 'user_id', 'createdAt', 'updatedAt']
      });
  
      console.log('Review found:', review); // Debugging log
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
  
      // Update review fields
      if (rating) review.rating = rating;
      if (feedback) review.feedback = feedback;
  
      // Save the updated review
      await review.save();
  
      return res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllReviews = async (req, res) => {
    try {
      const { product_id } = req.params;
  
      // Check if product_id exists in the database
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${product_id} not found.`,
        });
      }
  
      // Fetch reviews with related User and Product data
      const reviews = await ProductReview.findAll({
        where: { product_id },
        include: [
          {
            model: User,
            attributes: ['id', 'name'], // Ensure you don't reference UserId here
          },
          {
            model: Product,
            attributes: ['id', 'product_name'],
          },
        ],
        attributes: {
          exclude: ['UserId'], // This excludes the incorrect UserId column from the result
        },
      });
  
      const reviewCount = reviews.length;
  
      // Return success response with reviews data
      res.status(200).json({
        success: true,
        message: 'Reviews retrieved successfully.',
        reviewCount,
        reviews,
      });
    } catch (error) {
      console.error('Error retrieving reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving reviews.',
        error: error.message,
      });
    }
};

const deleteReview = async (req, res) => {
    try {
      const { review_id } = req.params;
  
      const review = await ProductReview.findByPk(review_id, {
        attributes: { exclude: ['UserId'] }, 
      });
  
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found.',
        });
      }
  
      await review.destroy();
  
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting review.',
        error: error.message,
      });
    }
};
  
  

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
