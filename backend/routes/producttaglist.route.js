const express = require("express");
const router = express.Router();

const {
  addProductTagList,
  updateProductTagList,
  deleteProductTagList,
} = require("../controllers/producttaglist.controller");

router.post("/add", addProductTagList);
router.put("/update/:id", updateProductTagList);
router.delete("/delete/:id", deleteProductTagList);

module.exports = router;
