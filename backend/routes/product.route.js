const express = require("express");
const router = express.Router();
<<<<<<< Updated upstream
const productController = require("../controllers/product.controller");
=======
const productController = require('../controllers/product.controller');


router.post('/add-physical-product', productController.insertPhysicalProduct);
>>>>>>> Stashed changes

// Route to add a role
router.get("/test", productController.test);

module.exports = router;
