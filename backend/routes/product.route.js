const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post('/add-physical-product', productController.insertPhysicalProduct);
router.get('/get-physical-product/:id', productController.getPhysicalProductWithDetails);
router.get('/get-all-physical-product', productController.getAllPhysicalProducts);
router.delete('/delete-physical-product/:id', productController.deletePhysicalProduct);

router.post("/add-digital-product", productController.insertDigitalProduct);

<<<<<<< Updated upstream
=======
router.patch("/update-physical-product/:id", productController.updatePhysicalProduct);
router.get("/get-all-product", productController.getAllProducts);
>>>>>>> Stashed changes

module.exports = router;
