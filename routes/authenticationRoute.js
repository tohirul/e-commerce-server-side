const express = require("express");
const {
    registerUser,
    logInUser,
    logOutUser,
} = require("../controllers/AuthenticationController");

const router = express.Router();
// Registration
router.route("/register").post(registerUser);
// Log in
router.route("/login").post(logInUser);
// Log out
router.route("/logout").get(logOutUser);

module.exports = router;
