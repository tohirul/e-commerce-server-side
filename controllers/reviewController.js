const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const productCollection = require("../models/productModel");
const ErrorHandler = require("../utilities/errorHandler");

// Create A review
exports.productReview = catchAsyncErrors(async (req, res, next) => {
    // Destructure data from the request
    const { rating, comment, productId } = req.body;
    // console.log(req.user._id.toHexString());
    const id = productId; /* used to find the reviewed product */

    const review = {
        /* Both userId and name are taken form the user logged in */
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment,
    };

    const product = await productCollection.findById(id);

    // Err message if the product is not found
    if (!product) {
        return next(new ErrorHandler(`No product found with Id: ${id}`, 404));
    }

    // Check If the Product has already been reviewed
    const isReviewed = product.reviews.find(
        // Filtering through all the users that submitted previous reviews,
        // to find if any review was added by current user on this product before
        (review) => review.user.toString() === req.user._id.toString()
    );
    // If the product has been reviewed replace the previous review with the recent
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            //  to find the review to replace
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        // if there is no previous review for this product by this user
        product.reviews.push(review);
        // Number of reviews for this product
        product.numOfReviews = product.reviews.length;
    }
    // Counting the average rating
    // console.log(product.rating, "before");
    let totalRating = 0;

    product.reviews.forEach((rev) => {
        // Summation of all the ratings in review divided by the number of all reviews
        // Hence we find the average ratings out of 5
        totalRating = totalRating + rev.rating;
        // console.log(totalRating, "Inside forEach loop");
    });
    // console.log(`NumOfR:${product.numOfReviews} PRL:${product.reviews.length}`);
    // console.log(totalRating, "Outside forEach loop");
    product.rating = totalRating / product.reviews.length;
    // console.log(product.rating, "after");

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `${req.user.name}, You have successfully added a review to this product`,
    });
});

// Get All Reviews
exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
    // console.log("it works");
    // Use productId form the query to find the product
    const product = await productCollection.findById(req.query.productId);

    if (!product) {
        return next(
            new ErrorHandler("Reviews not found for this product.", 404)
        );
    }
    // console.log(product);

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// Remove Review
exports.removeReview = catchAsyncErrors(async (req, res, next) => {
    const product = await productCollection.findById(req.query.productId);

    if (!product) return next(new ErrorHandler("Product not found", 404));
    // console.log(product.reviews, "from product");
    // Filter all the reviews using ids and
    //the one that matches with the id form query will be filtered out
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    // console.log(reviews, "from after");

    // Counting the average rating
    let totalRating = 0;
    // Summation of all the ratings in review divided by the number of all reviews
    // Hence we find the average ratings out of 5
    reviews.forEach((rev) => {
        totalRating = totalRating + rev.rating;
    });
    // console.log(reviews.length, `total rating: ${totalRating}`);
    const rating = totalRating / reviews.length;

    // Number of reviews are the number of reviews
    // that exist inside the review array
    const numOfReviews = Number(reviews.length);

    await productCollection.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            rating,
            numOfReviews,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );
    res.status(200).json({
        success: true,
        message: "Review has been removed.",
    });
});
