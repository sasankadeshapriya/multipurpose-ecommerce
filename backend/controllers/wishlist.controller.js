const { Wishlist, User, Product } = require("../models");
const validator = require("fastest-validator");

const v = new validator();

function addWishlist(req, res) {
  var { user_id, product_id } = req.body;

  // Validate request
  const schema = {
    user_id: { type: "number" },
    product_id: { type: "number" },
  };

  const check = v.validate(req.body, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Wishlist.findOne({
    where: { user_id: user_id, product_id: product_id },
    attributes: {
      exclude: ["UserId"], // This excludes the incorrect UserId column from the result
    },
  })
    .then(function (wishlist) {
      if (wishlist) {
        return res.status(400).send({
          message: "Product already in wishlist",
        });
      }

      // check if user exists
      User.findByPk(user_id)
        .then(function (user) {
          if (!user) {
            return res.status(404).send({
              message: "User not found",
            });
          }

          // check if product exists
          Product.findByPk(product_id)
            .then(function (product) {
              if (!product) {
                return res.status(404).send({
                  message: "Product not found",
                });
              }

              Wishlist.create({ user_id: user_id, product_id: product_id })
                .then(function (wishlist) {
                  res.status(201).send(wishlist);
                })
                .catch(function (error) {
                  res.status(500).send({
                    message: "Error occurred 3",
                    error: error,
                  });
                });
            })
            .catch(function (error) {
              res.status(500).send({
                message: "Error occurred 2",
                error: error,
              });
            });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error occurred 1",
            error: error,
          });
        });
    })

    .catch(function (error) {
      res.status(500).send({
        message: "Error occurred 4",
        error: error,
      });
    });
}

function removeWishlist(req, res) {
  const id = req.params.id;

  // Validate request
  const schema = {
    id: { type: "number" },
  };

  const check = v.validate({ id: id }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Wishlist.findByPk(id)
    .then(function (wishlist) {
      if (!wishlist) {
        return res.status(404).send({
          message: "Wishlist not found",
        });
      }

      wishlist
        .destroy()
        .then(function () {
          res.status(200).send({
            message: "Removed from wishlist successfully",
          });
        })
        .catch(function (error) {
          res.status(500).send({
            message: "Error occurred",
            error: error,
          });
        });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error occurred",
        error: error,
      });
    });
}

function getWishlistByUser(req, res) {
  const user_id = req.params.user_id;

  // Validate request
  const schema = {
    user_id: { type: "string", positive: true, integer: true },
  };

  const check = v.validate({ user_id: user_id }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  // Get all details of the wishlist of the user and the product
  Wishlist.findAll({
    where: { user_id: user_id },
    include: [
      {
        model: Product,
      },
    ],
    attributes: {
      exclude: ["UserId"], // This excludes the incorrect UserId column from the result
    },
  })
    .then(function (wishlist) {
      res.status(200).json({
        success: true,
        message: "Wishlist retrieved successfully",
        wishlist: wishlist,
      });
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error occurred",
        error: error,
      });
    });
}

module.exports = {
  addWishlist: addWishlist,
  removeWishlist: removeWishlist,
  getWishlistByUser: getWishlistByUser,
};
