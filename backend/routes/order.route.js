const express = require("express");
const router = express.Router();

const { getAllOrder } = require("../controllers/order.controller");

router.get("/get-all", getAllOrder);

module.exports = router;
