const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shipping.controller");


router.post("/add", shippingController.addShipping);
router.patch("/edit/:id", shippingController.editShipping);
router.delete("/delete/:id", shippingController.deleteShipping);
router.get("/:id", shippingController.getShippingById);
router.get("/user/:user_id", shippingController.getAllShippingForUser);


module.exports = router;
