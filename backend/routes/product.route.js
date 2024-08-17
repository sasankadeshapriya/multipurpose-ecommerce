const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Route to add a role
router.get("/test", productController.addProduct);

module.exports = router;
