const express = require("express");
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

/* --- Admin Routes --- */

// Create a new product
router
    .route("/admin/product/new")
    .post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

// Update a product
router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct);

// Remove a product from database
router
    .route("/admin/product/:id")
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

/* --- User Routes --- */

// Show all products
router.route("/products").get(getAllProducts);

// Show product details
router.route("/product/:id").get(isAuthenticatedUser, getProductDetails);

module.exports = router;
