// Importing required Modules
const express = require("express");
const router = express.Router();
const Product = require("../models/product"); //Importing Product Schema
const mongoose = require("mongoose");

// Get all the Products
router.get("/", (req, res, next) => {
  Product.find() // Method to Find all the Products
    .exec() // Query Builder Method to Execute the Query and Return a Promise
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs); //Sending the Found Data
    })
    .catch((err) => {
      console.log(error);
      res.status(500).json({
        error: err, //Showing the Error
      });
    });
});

// Creating a new Product
router.post("/", (req, res, next) => {
  // Filling the details of new product to save
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save() //Saves the Data in Database and returns a Promise
    .then((result) => {
      console.log(result);
      // Showing the message on Completion of Product Creation
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: product,
      });
    })
    //Handling the other error
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "We have experienced an error",
        error: err,
      });
    });
});

// Finding a Specific Product through ProductId
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id) //Finds a product using the given Id arguement
    .exec()
    .then((doc) => {
      console.log(doc);
      //   Showing product if found, otherwise throwing an error message
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid Entry Found for provided entry",
        });
      }
    }) //Showing other types of errors
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "We have experienced an error",
        error: err,
      });
    });
});

// Updating Values of a Specific Product
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  // Getting new Key/Value to Update
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.findByIdAndUpdate({ _id: id }, { $set: updateOps }) //Finding and Updating the Product Details
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Updated Successfully",
        updatedProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "We have experienced an error",
        error: err,
      });
    });
});

// Deleting the Specific Product
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Deleted Successfully",
        deletedProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "We have experienced an error",
        error: err,
      });
    });
});

// Exporting the Router Module
module.exports = router;
