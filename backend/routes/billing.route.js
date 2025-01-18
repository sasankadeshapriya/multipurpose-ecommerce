const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing.controller");


router.post("/add", billingController.addBilling);
router.patch("/edit/:id", billingController.editBilling);
router.delete("/delete/:id", billingController.deleteBilling);
router.get("/:id", billingController.getBillingById);
router.get("/user/:user_id", billingController.getAllBillingForUser);


module.exports = router;
