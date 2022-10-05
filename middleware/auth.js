const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utilities/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    // console.log(token);
    if (!token) {
        return next(
            new ErrorHandler("Please login to access this resource", 401)
        );
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    // console.log(req.user);
    next();
});

exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        // console.log(roles, req.user.role);
        const isAuthorized = roles.includes(req.user.role) ? true : false;
        // console.log(isAuthorized);

        if (!isAuthorized)
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        // if the user has the authorized role to proceed
        next();
    };
};
