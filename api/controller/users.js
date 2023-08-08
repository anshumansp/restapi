const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.users_signup = (req, res, next) => {
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
};

exports.users_login = (req, res, next) => {
  const email = req.body.email;
  User.find({ email: email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "Authentication Failed",
        });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, success) => {
          if (err) {
            res.status(409).json({
              message: "Authentication Failed",
            });
          } else if (success) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
              },
              "thisisanshumansecretkey",
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              message: "Authentication Successful",
              token: token,
            });
          } else {
            res.status(409).json({
              message: "Authentication Failed",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.users_delete = (req, res, next) => {
  const id = req.params.userId;
  User.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      if (!result) {
        res.status(500).json({
          message: "No Such User Found",
        });
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
};
