// Importing required Modules
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth"); //Importing Authentication Check Middleware
const productController = require("../controller/products");
const uploadFromMulter = require("../controller/multer");

// Get all the Products
router.get("/", productController.products_get_all);

// Creating a new Product
router.post(
  "/",
  checkAuth,
  uploadFromMulter.single("productImage"),
  productController.products_post_all
);

// Finding a Specific Product through ProductId
router.get("/:productId", productController.products_get_product);

// Updating Values of a Specific Product
router.patch(
  "/:productId",
  checkAuth,
  productController.products_patch_product
);

// Deleting the Specific Product
router.delete(
  "/:productId",
  checkAuth,
  productController.products_delete_product
);

// Exporting the Router Module
module.exports = router;