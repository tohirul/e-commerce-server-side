const express = require("express");
const {
    newOrder,
    getSingleOrder,
    currentUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

/* --- Admin Routes --- */

// Show all orders taken
router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);

// Update order status
router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrderStatus);

// Delete Order
router
    .route("/admin/order/delete/:id")
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

/* --- User Routes --- */

// Post new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// Get single order
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// Current Users orders
router.route("/orders/me").get(isAuthenticatedUser, currentUserOrders);

module.exports = router;
