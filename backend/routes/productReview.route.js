const express = require("express");
const router = express.Router();
const productReviewController = require("../controllers/productReview.controller");

router.post('/insert-reviews', productReviewController.createReview);
router.get('/get-reviews/:product_id', productReviewController.getAllReviews);
router.patch('/update-reviews/:id', productReviewController.updateReview);
router.delete('/delete-reviews/:review_id', productReviewController.deleteReview);

module.exports = router;
