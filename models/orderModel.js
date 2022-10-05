const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    // object to take in shipping information
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    // Array of items that are ordered
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
        },
    ],
    // User Id
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    // Object contains payment information
    paymentInfo: {
        id: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },

    paidAt: {
        type: Date,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    taxCost: {
        type: Number,
        required: true,
        default: 0,
    },
    shippingExpense: {
        type: Number,
        required: true,
        default: 0,
    },
    totalExpense: {
        type: Number,
        required: true,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("order", orderSchema);
