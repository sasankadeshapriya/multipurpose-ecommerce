const express = require('express');
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post('/add-physical-product', productController.insertPhysicalProduct);
router.get('/get-physical-product/:id', productController.getPhysicalProductWithDetails);
router.get('/get-all-physical-product', productController.getAllPhysicalProducts);

module.exports = router;
