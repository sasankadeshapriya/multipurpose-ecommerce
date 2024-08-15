const express = require("express");
const router = express.Router();

const {
  addCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");

router.post("/add", addCoupon);
router.put("/update/:id", updateCoupon);
router.delete("/delete/:id", deleteCoupon);

module.exports = router;
