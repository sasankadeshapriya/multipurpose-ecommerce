const express = require("express");
const router = express.Router();
const colorController = require("../controllers/color.controller");

router.post("/add", colorController.addColor);
router.patch("/edit/:id", colorController.editColor);
router.delete("/delete/:id", colorController.deleteColor);

module.exports = router;
