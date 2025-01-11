const express = require("express");
const router = express.Router();

const {
  addWishlist,
  removeWishlist,
  getWishlistByUser,
} = require("../controllers/wishlist.controller");

router.post("/add", addWishlist);
router.delete("/remove", removeWishlist);
router.get("/get/:user_id", getWishlistByUser);

module.exports = router;
