const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');

router.get('/', (req, res, next)=> {
    res.status(200).json({
        message: 'Orders have been fetched'
    });
});

router.post('/', (req, res, next)=> {
    const order = {
      productId: req.body.productId,
      quantity: req.body.quantity,
    };

    
    res.status(201).json({
        message: 'Orders have been created',
        createdOrder: order
    })
})

router.get('/:orderId', (req, res, next)=> {
    res.status(200).json({
        message: 'Order Details', 
        orderId: req.params.orderId
    })
})

router.post('/:orderId', (req, res, next)=> {
    const orderId = req.params.orderId
    res.status(200).json({
        message: `Order with OrderId ${orderId} Created`, 
    })
})

router.patch('/:orderId', (req, res, next)=> {
    const orderId = req.params.orderId
    res.status(200).json({
        message: `Order ${orderId} Updated`, 
    })
})

router.delete('/:orderId', (req, res, next)=> {
    const orderId = req.params.orderId;
    res.status(200).json({
        message: `Order ${orderId} Deleted`, 
    })
})

module.exports = router;