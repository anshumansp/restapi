const mongoose = require('mongoose');

// Creating the Product Schema for defining the Query Keys and their Data Types to be stored
const productSchema = mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    name : String,
    price: Number
});

// Making the Model and new Collection of products and using the Product Schema
module.exports = mongoose.model("Product", productSchema);