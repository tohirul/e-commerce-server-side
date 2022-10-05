const productCollection = require("../models/productModel");
const ErrorHandler = require("../utilities/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utilities/apiFeatures");
const { countDocuments } = require("../models/productModel");

/* --- Admin Methods --- */

// create product -- Admin access
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.productCreator = {
        id: req.user.id,
        name: req.user.name,
    };
    const product = await productCollection.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});

// update product -- Admin access
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    const productId = req.params.id;
    let product = await productCollection.findById(productId);
    if (!product) {
        return next(new ErrorHandler("Product not found in database", 404));
    } else {
        product = await productCollection.findByIdAndUpdate(
            productId,
            req.body,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );
        res.status(200).json({
            success: true,
            message: "Product has been updated",
        });
    }
});

// Delete product --Admin access
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    const product = await productCollection.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product not found in database", 404));
    } else {
        await product.remove();
        res.status(200).json({
            success: true,
            message: "Product Deleted successfully",
        });
    }
});

/* --- User Methods --- */

// Get Product Details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;

    const product = await productCollection.findById(id);

    // if the product not found
    if (!product) {
        // send message
        return next(new ErrorHandler("Product not found in database", 404));
    } else
        res.status(200).json({
            success: true,
            message: "Product exists",
            product,
        });
});

// Get all products from database
exports.getAllProducts = catchAsyncError(async (req, res) => {
    // to show results per page
    const resultPerPage = 5;

    const productCount = await productCollection.countDocuments();
    // API Features is created and Used to filter the search results in accordance to certain fields
    const apiFeature = new ApiFeatures(productCollection.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    // const products = await Product.find();
    const products = await apiFeature.query;
    res.status(200).json({ success: true, products, productCount });
});
