const express = require("express");
const router = express.Router();
const {
  physicalProductAdd,
  digitalProductAdd,
} = require("../controllers/product.controller");
const { getUploader } = require("../utils/image-uploader");

// Middleware for image upload specific to product images
const uploadProductImage = getUploader("products").single("image");

// Route to add a new physical product
router.post("/add-physical-product", uploadProductImage, physicalProductAdd);
router.post("/add-digital-product", digitalProductAdd);

module.exports = router;
