const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userCollection = require("../models/userModel");
const ErrorHandler = require("../utilities/errorHandler");
const sendToken = require("../utilities/JWTToken");
const sendEmail = require("../utilities/sendEmail");
const crypto = require("crypto");

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // when trying to reset the password
    // user has give the mail that is used to create the account
    // in order to verify that he is the user
    const user = await userCollection.findOne({
        email: req.body.email,
    });
    // If no user is found with the email
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPasswordToken
    // user.getResetPasswordToken is a method Generated in user.Schema
    // it uses crypto.randombytes to generate a token
    const resetToken = user.getResetPasswordToken();

    await user.save({
        validateBeforeSave: false,
    });
    // Password Reset URL that will be mailed to the users mail
    const resetPasswordURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/password/reset/${resetToken}`;

    // Email Message Template
    const message = `Your Password reset token is: \n\n ${resetPasswordURL} \n\n If you have not requested this email then please ignore it. Thank You.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `E-commerce password recovery.`,
            message: message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`,
        });
    } catch (error) {
        // While in error reset the token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({
            validateBeforeSave: false,
        });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Creating Hash Token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await userCollection.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or might have already expired",
                400
            )
        );

    if (req.body.password !== req.body.confirmPassword)
        return next(new ErrorHandler("Passwords do not match", 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await userCollection.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await userCollection.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched)
        return next(new ErrorHandler("Old password did not match", 400));

    if (req.body.newPassword !== req.body.confirmPassword)
        return next(new ErrorHandler("Entered Passwords don't match"));

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

// Update User Profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserDetails = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await userCollection.findByIdAndUpdate(
        req.user.id,
        newUserDetails,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
        message: "Profile has been updated successfully.",
        user,
    });
});
