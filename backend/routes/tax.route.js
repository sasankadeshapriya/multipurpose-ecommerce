const express = require("express");
const router = express.Router();

const {getAllTaxes, getByIdTax, addTax, editTax, deleteTax } = require("../controllers/tax.controller");

router.get("/get-all", getAllTaxes);
router.get("/get/:id", getByIdTax);
router.post("/add", addTax);
router.put("/edit/:id", editTax);
router.delete("/delete/:id", deleteTax);


module.exports = router;
