const mongoose = require('mongoose');

// Creating the Product Schema for defining the Query Keys and their Data Types to be stored
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  //Making Sure that both these parameters must be passed with correct Data Types
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
});

// Making the Model and new Collection of products and using the Product Schema
module.exports = mongoose.model("Product", productSchema);