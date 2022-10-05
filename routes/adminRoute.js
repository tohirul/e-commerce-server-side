const express = require("express");
const {
    getAllUsers,
    getUser,
    removeUser,
    updateRole,
} = require("../controllers/adminController");
const { authorizedRoles, isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

// Get All Users
router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

// Get Single User
router
    .route("/admin/getUser/:id")
    .get(isAuthenticatedUser, authorizedRoles("admin"), getUser);

// Update User Role
router
    .route("/admin/updateUserRole/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateRole);

// Remove User
router
    .route("/admin/removeUser/:id")
    .delete(isAuthenticatedUser, authorizedRoles("admin"), removeUser);

module.exports = router;
