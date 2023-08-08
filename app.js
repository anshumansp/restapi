// Importing Express and Making Express App
const express = require("express");
const app = express();

// Importing the required modules
const morgan = require("morgan"); // Logs all the data into console
const bodyParser = require("body-parser"); //Middleware for Parsing the data into usable formats
const mongoose = require("mongoose"); // ODM for MongoDB and Node JS

// Importing files to handle the requests
const productsRoute = require("./api/routes/products");
const ordersRoute = require("./api/routes/orders");
const usersRoute = require("./api/routes/users");

// Connecting to MongoDB Cloud(Atlas)
const mongoURI =
  "mongodb+srv://anshumansp:" +
  encodeURIComponent("MongoDB@2$") +
  "@cluster0.ezqihij.mongodb.net/himanshuDB?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Applying required middlewares
app.use('/uploads', express.static('uploads')); // Static File Serving and Making it accessible globally.
app.use(morgan("dev")); // Log requests in dev format
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

// Handling Pre-flight Requests and Setting Headers for CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH");
    return res.status(200).json({});
  }
  next(); //Passing control to next Middleware Function
});

// Forwarding the requests to specific routes
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/users", usersRoute);

// Handling 'Not-Found' Errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Handling other Errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Exporting the module for starting the server
module.exports = app;
