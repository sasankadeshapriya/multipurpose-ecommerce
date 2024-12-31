const express = require('express');
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post('/add-physical-product', productController.insertPhysicalProduct);

module.exports = router;
