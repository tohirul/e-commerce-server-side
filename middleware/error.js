// A function to handle error dynamically
const ErrorHandler = require("../utilities/errorHandler");

// function to determine the error and generate the message in response
module.exports = (err, req, res, next) => {
    // set error status code and error message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Cast Error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue())} entered.`;
        err = new ErrorHandler(message, 400);
    }

    // JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err,
    });
};
