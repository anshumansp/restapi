const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(200).json({
                  message: "User created successfully",
                  request: {
                    type: "POST",
                    description: "FOR LOGIN, VISIT THE GIVEN URL",
                    url: "http://localhost:3000/users/login",
                    body: {
                      email: "String",
                      password: "String",
                    },
                  },
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      if (!result) {
        res.status(500).json({
            message: 'No Such User Found'
        })
      } else {
        res.status(200).json({
          message: "User Deleted Successfully",
          request: {
            type: "POST",
            description: "CREATE A NEW USER",
            url: "http://localhost:3000/users/signup/",
            body: {
              email: "String",
              password: "String",
            },
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
