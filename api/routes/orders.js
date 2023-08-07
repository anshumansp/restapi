const express = require('express');
const router = express.Router();
const Product = require("../models/product");
const Order = require("../models/order");
const checkAuth = require("../middleware/check-auth");
const mongoose = require("mongoose");

router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate('product', 'name price')
    .exec()
    .then((docs) => {
      res.status(201).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              description: "FIND MORE ABOUT IT",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", checkAuth, (req, res, next) => {
  Product.findById(req.body.product)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order Created Successfully",
        createdProduct: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          description: "FIND MORE ABOUT IT",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId", checkAuth, (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("_id product quantity")
    .populate('product', 'name price')
    .exec()
    .then((order) => {
      if(!order) {
        res.status(404).json({
            message: 'Order Not Found'
        })
      }
      res.status(201).json({
        order: order,
        request: {
          type: "GET",
          description: "FIND ALL ORDERS",
          url: "http://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:orderId", checkAuth, (req, res, next) => {
  const orderId = req.params.orderId;
  const newQuantity = req.body.newQuantity;
  const updateOps = {
    quantity: newQuantity,
  };
  Order.findByIdAndUpdate({ _id: orderId }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order Updated Successfully",
        request: {
          type: "GET",
          description: "FIND MORE DETAIL OF THIS ORDER",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:orderId', checkAuth, (req, res, next)=> {
    const orderId = req.params.orderId;
    Order.findByIdAndRemove({_id: orderId})
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order Deleted Successfully",
        request: {
          type: "POST",
          description: "CREATE A NEW ORDER",
          url: "http://localhost:3000/orders/",
          body: {
            productId : 'ID',
            quantity :  'Number'
          }
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
})

module.exports = router;