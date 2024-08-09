const express = require("express");
const router = express.Router();
const { addBrand,updateBrand,deleteBrand } = require("../controllers/brand.controller");
const { getUploader } = require('../utils/image-uploader');

// Middleware for image upload
const uploadBrandImage = getUploader('brands').single('brand_image');

router.post('/add', uploadBrandImage, addBrand);
router.patch('/update/:id', uploadBrandImage, updateBrand);
router.delete('/delete/:id', deleteBrand);

module.exports = router;
