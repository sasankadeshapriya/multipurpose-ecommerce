const express = require("express");
const router = express.Router();

const {
  getAllDeliveryCharge,
  getDeliveryChargeById,
  addDeliveryCharge,
  editDeliveryCharge,
  deleteDeliveryCharge,
} = require("../controllers/deliverycharge.controller");

router.get("/get-all", getAllDeliveryCharge);
router.get("/get/:id", getDeliveryChargeById);
router.post("/add", addDeliveryCharge);
router.put("/edit/:id", editDeliveryCharge);
router.delete("/delete/:id", deleteDeliveryCharge);

module.exports = router;
