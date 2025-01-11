const { Wishlist } = require("../models");
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

  Wishlist.findAll({
    where: { user_id: user_id, product_id: product_id },
  })
    .then(function (wishlist) {
      if (wishlist.length > 0) {
        return res.status(400).send({
          message: "Wishlist already exists",
          errors: [
            {
              field: user_id,
              message:
                "Wishlist with this user_id and product_id already exists",
            },
          ],
        });
      }

      // Check if user_id exists in the User table
      User.findByPk(user_id)
        .then(function (user) {
          if (!user) {
            return res.status(404).send({
              message: "User not found",
              errors: [
                {
                  field: user_id,
                  message: "User with this user_id does not exist",
                },
              ],
            });
          }

          // Check if product_id exists in the Product table
          Product.findByPk(product_id)
            .then(function (product) {
              if (!product) {
                return res.status(404).send({
                  message: "Product not found",
                  errors: [
                    {
                      field: product_id,
                      message: "Product with this product_id does not exist",
                    },
                  ],
                });
              }

              Wishlist.create({ user_id, product_id })
                .then(function (wishlist) {
                  res
                    .status(201)
                    .send(wishlist)
                    .message("Added to wishlist successfully");
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
    user_id: { type: "number" },
  };

  const check = v.validate({ user_id: user_id }, schema);

  if (check !== true) {
    return res.status(400).send({
      message: "Validation failed",
      errors: check,
    });
  }

  Wishlist.findAll({
    where: { user_id: user_id },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["name", "price", "description"],
      },
    ],
  })
    .then(function (wishlist) {
      res.status(200).send(wishlist);
    })
    .catch(function (error) {
      res.status(500).send({
        message: "Error occurred",
        error: error,
      });
    });
}
