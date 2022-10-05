const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utilities/errorHandler");
const sendToken = require("../utilities/JWTToken");
const userCollection = require("../models/userModel");

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    // Destructure the data from req.body
    const { name, email, password } = req.body;
    // Create a user using the data
    const user = await userCollection.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "https://i.ibb.co/jk9pYV9/52740108-2329620223935245-1225477022793334784-n-2-removebg-preview.png",
        },
    });
    sendToken(user, 201, res);
});

// Log in as a user
exports.logInUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user has provided with both email and password
    if (!email || !password)
        // if the condition to proceed doesn't meet send the error
        return next(new ErrorHandler("Please Enter Email and Password", 400));

    const user = await userCollection.findOne({ email }).select("+password");

    // If user isn't found
    if (!user) return next(new ErrorHandler("User profile not found", 401));

    // Checking if password matches
    const isPasswordMatched = user.comparePassword(password);

    // If password doesn't match
    if (!isPasswordMatched)
        return next(new ErrorHandler("Invalid Email or password", 401));

    // Finally if all the conditions are met
    sendToken(user, 200, res);
});

// Log out user
exports.logOutUser = catchAsyncErrors(async (req, res, next) => {
    // To log out instantly reset the cookie expiration to now
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "User has logged out successfully",
    });
});
