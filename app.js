const express = require("express");
// Import Routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const admin = require("./routes/adminRoute");
const review = require("./routes/reviewRoute");
const auth = require("./routes/authenticationRoute");
const order = require("./routes/orderRoute");
// Error Middleware
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use(cookieParser());

// API URL
app.use("/api/v1", auth); // Auth API
app.use("/api/v1", admin); // Admin API
app.use("/api/v1", user); // User API
app.use("/api/v1", product); // Product API
app.use("/api/v1", review); // Review API
app.use("/api/v1", order); // Order API

module.exports = app;
