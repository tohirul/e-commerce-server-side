const productCollection = require("../models/productModel");

// when called upon this function will be used to decrease the amount of products in stock
const updateStock = async (id, quantity) => {
    const product = await productCollection.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
};
module.exports = updateStock;
