const express = require("express");
const {
    productReview,
    removeReview,
    getAllReviews,
} = require("../controllers/reviewController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

/* --- Authenticated User --- */

router.route("/product/review").put(isAuthenticatedUser, productReview);
router
    .route("/product/review/remove")
    .delete(isAuthenticatedUser, removeReview);

/* --- Normal User --- */

router.route("/reviews").get(getAllReviews);

module.exports = router;
