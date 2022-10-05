const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userCollection = require("../models/userModel");
const ErrorHandler = require("../utilities/errorHandler");

// Get All Users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await userCollection.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get Single User
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userCollection.findById(req.params.id);

    if (!user)
        return next(
            new ErrorHandler(
                `User was not found with id: ${req.params.id}`,
                400
            )
        );

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Role
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
    // const newUserData = {
    //     role: req.body.role,
    // };

    // const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    //     new: true,
    //     runValidators: true,
    //     useFindAndModify: false,
    // });

    const user = await userCollection.findById(req.params.id);

    user.role = req.body.role;
    user.save();

    res.status(200).json({
        success: true,
        message: `Role has been updated to ${user.role}`,
        user,
    });
});

// Delete User
exports.removeUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userCollection.findById(req.params.id);

    if (!user)
        return next(
            new ErrorHandler(`User does not exits with Id: ${req.params.id}`)
        );

    await user.remove();

    res.status(200).json({
        success: true,
        message: `User:${user.name} has been removed successfully`,
    });
});
