const express = require("express");
const router = express.Router();

const { getAllCurrency, getCurrencyById, addCurrency, editCurrency, deleteCurrency } = require("../controllers/currency.controller");

router.get("/get-all", getAllCurrency);
router.get("/get/:id", getCurrencyById);
router.post("/add", addCurrency);
router.put("/edit/:id", editCurrency);
router.delete("/delete/:id", deleteCurrency);

module.exports = router;
