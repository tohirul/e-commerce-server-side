const express = require("express");

const {
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateUserProfile,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

/* --- Authenticated User --- */

router.route("/profile").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/profile/update").put(isAuthenticatedUser, updateUserProfile);

/* --- Password Reset --- */

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
