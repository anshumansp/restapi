const mongoose = require('mongoose');

// Creating the Order Schema for defining the Query Keys and their Data Types to be store
const orderSchema = mongoose.Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    //Product is having the object id of the existing produt and it is required 
    product: { type: mongoose.Schema.Types.ObjectId, ref:'Product', required: true },
    // Quantity should be of Number and if no quantity is placed it will set to 1 by default
    quantity: { type: Number, default: 1},
  });

  // Making the Model and new Collection of products and using the Product Schema
module.exports = mongoose.model('Order', orderSchema);