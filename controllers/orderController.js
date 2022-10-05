const orderCollection = require("../models/orderModel.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const productCollection = require("../models/productModel");
const ErrorHandler = require("../utilities/errorHandler.js");
const updateStock = require("../middleware/updateStock.js");

/* --- Admin Methods --- */

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await orderCollection.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalExpense;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// Update Order Status -- Admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    // console.log(orderId);
    const order = await orderCollection.findById(orderId);

    if (order.status === "delivered")
        return next(
            new ErrorHandler("You have already delivered this order", 400)
        );

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") order.deliveredAt = Date.now();

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
});

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await orderCollection.findById(orderId);
    if (!order)
        return next(
            new ErrorHandler("Order you are looking for is not found", 404)
        );

    await order.remove();
    res.status(200).json({
        success: true,
        message: "Order has been removed successfully.",
    });
});

/* --- User Methods --- */

// Set a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    // Destructure the data from the request
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxCost,
        shippingExpense,
        totalExpense,
    } = req.body;

    const order = await orderCollection.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxCost,
        shippingExpense,
        totalExpense,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: `You have successfully ordered this product`,
        order,
    });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.id;
    // Using id to locate the order
    const order = await orderCollection
        .findById(orderId)
        // using .populate to get the initials of the user that placed the order
        .populate("user", "name email");

    if (!order) return next(new ErrorHandler("Order not found", 404));

    res.status(200).json({
        success: true,
        order: order,
    });
});

// Get Orders made by logged in user
exports.currentUserOrders = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    // console.log(userId);
    const orders = await orderCollection.find({ user: userId });

    // if orders.length === 0 there is no order in the order array thus the error message
    if (orders.length === 0)
        return next(
            new ErrorHandler(
                `${req.user.name}, looks like you haven't ordered anything from us yet.`,
                404
            )
        );

    res.status(200).json({
        success: true,
        orders,
    });
});
