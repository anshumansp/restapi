const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');

const mongoURI = 'mongodb+srv://anshumansp:' + encodeURIComponent('MongoDB@2$') + '@cluster0.ezqihij.mongodb.net/himanshuDB?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    };
    next();
});

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.use((req, res, next)=> {
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
});

app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;