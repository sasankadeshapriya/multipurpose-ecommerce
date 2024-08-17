const express = require('express');
const router = express.Router();
const { physicalProductAdd } = require('../controllers/product.controller');
const { getUploader } = require('../utils/image-uploader');

// Middleware for image upload specific to product images
const uploadProductImage = getUploader("products").single("image");

// Route to add a new physical product
router.post('/add-physical-product', uploadProductImage, physicalProductAdd);

module.exports = router;
