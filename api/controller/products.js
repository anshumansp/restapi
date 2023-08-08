const mongoose = require("mongoose");
const Product = require("../models/product"); //Importing Product Schema

exports.products_get_all = (req, res, next) => {
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
};

exports.products_post_all = (req, res, next) => {
  console.log(req.file);
  // Filling the details of new product to save
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
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
};

exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id) //Finds a product using the given Id arguement
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log(doc);
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
};

exports.products_patch_product = (req, res, next) => {
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
};

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product Deleted Successfully",
        request: {
          type: "POST",
          description: "CREATE A NEW PRODUCT",
          url: "http://localhost:3000/products/",
          body: {
            name: "String",
            price: "Number",
          },
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
};
