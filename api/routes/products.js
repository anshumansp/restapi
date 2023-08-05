const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next)=> {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
})

router.post('/', (req, res, next)=> {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result)
    })
    .catch(err => console.log(err));
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    })
})

router.get('/:productId', (req, res, next)=> {
    const id = parseInt(req.params.productId);
    if(id === 1000) {
        res.status(200).json({
            message: `Your Id ${id} is a special ID`
        })
    } else {
        res.status(200).json({
            message: `You have passed the normal id ${id}`
        })
    }
})

router.patch('/:productId', (req, res, next)=> {
    const id = parseInt(req.params.productId);
    res.status(200).json({
        message: `Updated Product ${id}`
    })
})

router.delete('/:productId', (req, res, next)=> {
    const id = parseInt(req.params.productId);
    res.status(200).json({
        message: `Deleted Product ${id}`
    })
})

module.exports = router;