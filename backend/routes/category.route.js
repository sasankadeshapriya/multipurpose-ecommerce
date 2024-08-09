const express = require("express");
const router = express.Router();
const {
  addCategory,
  updateCategory,
  deleteCategory,
  changeStatus,
} = require("../controllers/category.controller");

router.post("/add", addCategory);
router.patch("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);
router.patch("/status/:id", changeStatus);

module.exports = router;
