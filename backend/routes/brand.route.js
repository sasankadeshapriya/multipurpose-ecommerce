const express = require("express");
const router = express.Router();
const { addBrand } = require("../controllers/brand.controller");
const { getUploader } = require('../utils/image-uploader');

// Middleware for image upload
const uploadBrandImage = getUploader('brands').single('brand_image');

router.post('/add', uploadBrandImage, addBrand);

module.exports = router;
