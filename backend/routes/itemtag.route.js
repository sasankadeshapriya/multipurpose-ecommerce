const express = require("express");
const router = express.Router();

const {
  addItemTag,
  updateItemTag,
  deleteItemTag,
} = require("../controllers/itemtag.controller");

router.post("/add", addItemTag);
router.put("/update/:id", updateItemTag);
router.delete("/delete/:id", deleteItemTag);

module.exports = router;
