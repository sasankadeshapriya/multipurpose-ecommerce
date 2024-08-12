const express = require("express");
const router = express.Router();
const {
  addSize,
  updateSize,
  deleteSize,
} = require("../controllers/size.controller");

router.post("/add", addSize);
router.patch("/update/:id", updateSize);
router.delete("/delete/:id", deleteSize);

module.exports = router;
