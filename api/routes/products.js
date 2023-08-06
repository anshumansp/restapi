// Importing required Modules
const express = require("express");
const router = express.Router();
const Product = require("../models/product"); //Importing Product Schema
const mongoose = require("mongoose");
const multer = require('multer'); //Parses Form Data including images

// Adding Storage and Filename to Multer for Storing Images
const storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, './uploads/')
  },
  filename: function(req, file, callback){
    const timestamp = new Date().toISOString().replace(/:/g, '-')
    callback(null, timestamp + file.originalname);
  }
});

// Putting Limits on File Acceptance
const limits = {
  fileSize: 1024*1024*5
}

// Filtering file types 
const fileFilter = (req, file, cb)=> {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Image Type Not Supported'), false)
  }
}

// Multer middleware for handling file uploads with specific options
const upload = multer({storage: storage, limits: limits, fileFilter: fileFilter});

// Get all the Products
router.get("/", (req, res, next) => {
  Product.find() // Method to Find all the Products
    .select("name price _id productImage") // Controlling the params we want to show
    .exec() // Query Builder Method to Execute the Query and Return a Promise
    .then((docs) => {
      // Sending a More Meaningful Response
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              description: "FIND MORE DETAIL OF THIS PRODUCT",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response); //Sending the Found Data
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err, //Showing the Error
      });
    });
});

// Creating a new Product
router.post("/", upload.single('productImage'), (req, res, next) => {
  console.log(req.file)
  // Filling the details of new product to save
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product
    .save() //Saves the Data in Database and returns a Promise
    .then((result) => {
      // Showing the message on Completion of Product Creation
      res.status(201).json({
        message: "Created Product Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: "GET",
            description: "FIND MORE DETAIL OF THIS PRODUCT",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
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
    .select("name price _id")
    .exec()
    .then((doc) => {
      //   Showing product if found, otherwise throwing an error message
      if (doc) {
        res.status(200).json({
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          productImage: doc.productImage,
          request: {
            type: "GET",
            description: "FIND ALL PRODUCTS",
            url: "http://localhost:3000/products/",
          },
        });
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
    // Only allowing to update the values of the product
    if (ops.propName === "name") {
      updateOps["name"] = ops.value;
    } else if (ops.propName === "price") {
      updateOps["price"] = ops.value;
    } else {
      throw new Error("Properties not defined properly");
    }
  }
  Product.findByIdAndUpdate({ _id: id }, { $set: updateOps }) //Finding and Updating the Product Details
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Updated Successfully",
        request: {
          type: "GET",
          description: "FIND MORE DETAIL OF THIS PRODUCT",
          url: "http://localhost:3000/products/" + result._id,
        },
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
        message: "Product Deleted Successfully",
        request: {
            type: 'POST',
            description : 'CREATE A NEW PRODUCT',
            url: 'http://localhost:3000/products/',
            body: {
                name: "String",
                price: "Number"
            }
        }
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