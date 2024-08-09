const express = require("express");
const router = express.Router();
const { addCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");

router.post("/add", addCategory);
router.patch("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;