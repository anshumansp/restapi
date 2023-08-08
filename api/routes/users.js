const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const usersController = require("../controller/users");

router.post("/signup", usersController.users_signup);

router.post("/login", usersController.users_login);

router.delete("/:userId", checkAuth, usersController.users_delete);

module.exports = router;