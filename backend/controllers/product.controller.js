const { getUploader } = require("../utils/muliple-image-uploader");

const Validator = require("fastest-validator");
const {
  Product,
  Size,
  Color,
  SizeProduct,
  ColorProduct,
  ProductTag,
  ProductTagList,
  Brand,
  Category,
} = require("../models");

// Initialize Fastest Validator
const v = new Validator();

const productSchema = {
  product_name: { type: "string", min: 3, max: 150, empty: false },
  product_slug: { type: "string", min: 3, max: 150, empty: false },
  brand_id: { type: "number", optional: true, default: 1 },
  category_id: { type: "number", optional: true, default: 1 },
  item_tag: { type: "string", optional: true },
  quantity: { type: "number", integer: true, empty: false },
  price: { type: "number", positive: true, empty: false },
  discount: { type: "number", positive: true, optional: true },
  discount_price: { type: "number", positive: true, optional: true },
  about: { type: "string", empty: false },
  description: { type: "string", empty: false },
  shipping_return: { type: "string", empty: false },
  additional_nformation: { type: "string", optional: true },
  primary_image: { type: "string", empty: false },
  image2: { type: "string", optional: true },
  image3: { type: "string", optional: true },
  image4: { type: "string", optional: true },
  image5: { type: "string", optional: true },
  status: { type: "boolean", optional: true },
  featured_product: { type: "boolean", optional: true },
  best_selling: { type: "boolean", optional: true },
  on_sale: { type: "boolean", optional: true },
  new_arrival: { type: "boolean", optional: true },
  product_sizes: { type: "array", items: "number", optional: true },
  product_colors: { type: "array", items: "number", optional: true },
  product_tags_data: { type: "array", items: "number", optional: true },
  digital_type: { type: "string", optional: true },
  digital_link: { type: "string", optional: true },
  digital_file: { type: "string", optional: true },
  license_name: { type: "string", optional: true },
  license_key: { type: "string", optional: true },
  affiliate_link: { type: "string", optional: true },
};

// Middleware for handling multiple image uploads
const upload = getUploader("products").fields([
  { name: "primary_image", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "image5", maxCount: 1 },
]);

async function insertPhysicalProduct(req, res) {
  // Handle file upload
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images.",
        error: err.message,
      });
    }

    // Parse incoming data
    const data = req.body;

    // Map uploaded images to fields
    const images = req.files || {};
    data.primary_image = images.primary_image
      ? images.primary_image[0].filename
      : null;
    data.image2 = images.image2 ? images.image2[0].filename : null;
    data.image3 = images.image3 ? images.image3[0].filename : null;
    data.image4 = images.image4 ? images.image4[0].filename : null;
    data.image5 = images.image5 ? images.image5[0].filename : null;

    // Convert types
    data.brand_id = parseInt(data.brand_id, 10);
    data.category_id = parseInt(data.category_id, 10);
    data.quantity = parseInt(data.quantity, 10);
    data.price = parseFloat(data.price);
    data.discount = parseFloat(data.discount || 0);
    data.discount_price = parseFloat(data.discount_price || 0);
    data.status = data.status === "true";
    data.featured_product = data.featured_product === "true";
    data.best_selling = data.best_selling === "true";
    data.on_sale = data.on_sale === "true";
    data.new_arrival = data.new_arrival === "true";
    data.product_sizes = JSON.parse(data.product_sizes || "[]");
    data.product_colors = JSON.parse(data.product_colors || "[]");
    data.product_tags_data = JSON.parse(data.product_tags_data || "[]");

    // Validate request body
    const validationResponse = v.validate(data, productSchema);
    if (validationResponse !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResponse,
      });
    }

    // Set defaults for brand_id and category_id if null or empty
    data.brand_id = data.brand_id || 1;
    data.category_id = data.category_id || 1;

    try {
      // Check if brand_id exists
      const brand = await Brand.findByPk(data.brand_id);
      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand_id. The specified brand does not exist.",
        });
      }

      // Check if category_id exists
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category_id. The specified category does not exist.",
        });
      }

      // Verify product_sizes
      if (data.product_sizes && data.product_sizes.length > 0) {
        const sizes = await Size.findAll({ where: { id: data.product_sizes } });
        if (sizes.length !== data.product_sizes.length) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid product sizes. Some sizes do not exist in the database.",
          });
        }
      }

      // Verify product_colors
      if (data.product_colors && data.product_colors.length > 0) {
        const colors = await Color.findAll({
          where: { id: data.product_colors },
        });
        if (colors.length !== data.product_colors.length) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid product colors. Some colors do not exist in the database.",
          });
        }
      }

      // Verify product_tags_data and fetch tags
      let tags = [];
      if (data.product_tags_data && data.product_tags_data.length > 0) {
        tags = await ProductTagList.findAll({
          where: { id: data.product_tags_data },
        });
        if (tags.length !== data.product_tags_data.length) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid product tags. Some tags do not exist in the database.",
          });
        }
      }

      // Insert product
      const product = await Product.create({
        product_name: data.product_name,
        product_slug: data.product_slug,
        brand_id: data.brand_id,
        category_id: data.category_id,
        item_tag: data.item_tag,
        quantity: data.quantity,
        price: data.price,
        discount: data.discount,
        discount_price: data.discount_price,
        about: data.about,
        description: data.description,
        shipping_return: data.shipping_return,
        additional_nformation: data.additional_nformation,
        primary_image: data.primary_image,
        image2: data.image2,
        image3: data.image3,
        image4: data.image4,
        image5: data.image5,
        status: data.status,
        featured_product: data.featured_product,
        best_selling: data.best_selling,
        on_sale: data.on_sale,
        new_arrival: data.new_arrival,
        type: false,
      });

      // Handle product sizes association
      if (data.product_sizes && data.product_sizes.length > 0) {
        const sizePromises = data.product_sizes.map((sizeId) => {
          return SizeProduct.create({
            product_id: product.id,
            size_id: sizeId,
          });
        });
        await Promise.all(sizePromises);
      }

      // Handle product colors association
      if (data.product_colors && data.product_colors.length > 0) {
        const colorPromises = data.product_colors.map((colorId) => {
          return ColorProduct.create({
            product_id: product.id,
            color_id: colorId,
          });
        });
        await Promise.all(colorPromises);
      }

      // Handle product tags association
      if (data.product_tags_data && data.product_tags_data.length > 0) {
        const tagPromises = data.product_tags_data.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          return ProductTag.create({
            product_id: product.id,
            tag: tag.name,
          });
        });
        await Promise.all(tagPromises);
      }

      return res.status(201).json({
        success: true,
        message: "Product inserted successfully!",
        product,
      });
    } catch (error) {
      console.error("Error inserting product:", error);
      return res.status(500).json({
        success: false,
        message: "Error inserting product.",
        error: error.message || "An unexpected error occurred.",
      });
    }
  });
}

async function updatePhysicalProduct(req, res) {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  // Middleware for handling image uploads
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images.",
        error: err.message,
      });
    }

    const data = req.body;

    // Map uploaded images to fields
    const images = req.files || {};
    if (images.primary_image) data.primary_image = images.primary_image[0].filename;
    if (images.image2) data.image2 = images.image2[0].filename;
    if (images.image3) data.image3 = images.image3[0].filename;
    if (images.image4) data.image4 = images.image4[0].filename;
    if (images.image5) data.image5 = images.image5[0].filename;

    // Convert types
    data.brand_id = data.brand_id ? parseInt(data.brand_id, 10) : null;
    data.category_id = data.category_id ? parseInt(data.category_id, 10) : null;
    data.quantity = parseInt(data.quantity || 0, 10);
    data.price = parseFloat(data.price || 0);
    data.discount = parseFloat(data.discount || 0);
    data.discount_price = parseFloat(data.discount_price || 0);
    data.status = data.status === "true";
    data.featured_product = data.featured_product === "true";
    data.best_selling = data.best_selling === "true";
    data.on_sale = data.on_sale === "true";
    data.new_arrival = data.new_arrival === "true";
    data.product_sizes = JSON.parse(data.product_sizes || "[]");
    data.product_colors = JSON.parse(data.product_colors || "[]");
    data.product_tags_data = JSON.parse(data.product_tags_data || "[]");

    // Validate request body
    const validationResponse = v.validate(data, productSchema);
    if (validationResponse !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResponse,
      });
    }

    try {
      const product = await Product.findByPk(productId);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      // Update product data
      await product.update({
        product_name: data.product_name,
        product_slug: data.product_slug,
        brand_id: data.brand_id || product.brand_id,
        category_id: data.category_id || product.category_id,
        item_tag: data.item_tag,
        quantity: data.quantity,
        price: data.price,
        discount: data.discount,
        discount_price: data.discount_price,
        about: data.about,
        description: data.description,
        shipping_return: data.shipping_return,
        additional_nformation: data.additional_nformation,
        primary_image: data.primary_image || product.primary_image,
        image2: data.image2 || product.image2,
        image3: data.image3 || product.image3,
        image4: data.image4 || product.image4,
        image5: data.image5 || product.image5,
        status: data.status,
        featured_product: data.featured_product,
        best_selling: data.best_selling,
        on_sale: data.on_sale,
        new_arrival: data.new_arrival,
      });

      // Update associated sizes
      if (data.product_sizes.length === 0) {
        await SizeProduct.destroy({ where: { product_id: productId } });
      } else {
        await SizeProduct.destroy({ where: { product_id: productId } });
        const sizePromises = data.product_sizes.map((sizeId) =>
          SizeProduct.create({ product_id: productId, size_id: sizeId })
        );
        await Promise.all(sizePromises);
      }

      // Update associated colors
      if (data.product_colors.length === 0) {
        await ColorProduct.destroy({ where: { product_id: productId } });
      } else {
        await ColorProduct.destroy({ where: { product_id: productId } });
        const colorPromises = data.product_colors.map((colorId) =>
          ColorProduct.create({ product_id: productId, color_id: colorId })
        );
        await Promise.all(colorPromises);
      }

      // Update associated tags
      if (data.product_tags_data.length === 0) {
        await ProductTag.destroy({ where: { product_id: productId } });
      } else {
        await ProductTag.destroy({ where: { product_id: productId } });
        const tags = await ProductTagList.findAll({
          where: { id: data.product_tags_data },
        });
        const tagPromises = tags.map((tag) =>
          ProductTag.create({
            product_id: productId,
            tag: tag.name,
          })
        );
        await Promise.all(tagPromises);
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        product,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating product.",
        error: error.message || "An unexpected error occurred.",
      });
    }
  });
}


async function getPhysicalProductWithDetails(req, res) {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  try {
    // Find product by ID with all related associations
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Brand,
          attributes: ["id", "brand_slug", "brand_image"], // Include existing Brand attributes
        },
        {
          model: Category,
          attributes: ["id", "category_name", "category_slug"], // Match defined Category attributes
        },
        {
          model: Size,
          through: { attributes: [] }, // Exclude join table attributes
          as: "sizes", // Use alias defined in association
          attributes: ["id", "size"], // Match defined Size attributes
        },
        {
          model: Color,
          through: { attributes: [] }, // Exclude join table attributes
          as: "colors", // Use alias defined in association
          attributes: ["id", "name", "color_code"], // Match defined Color attributes
        },
        {
          model: ProductTag, // Now ProductTag is associated with Product
          attributes: ["id", "tag"], // Include ProductTag attributes
        },
      ],
    });

    // If product is not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Return the product data with ProductTag details
    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully.",
      product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving product.",
      error: error.message || "An unexpected error occurred.",
    });
  }
}

async function getAllPhysicalProducts(req, res) {
  try {
    // Find all products with all related associations
    const products = await Product.findAll({
      include: [
        {
          model: Brand,
          attributes: ["id", "brand_slug", "brand_image"], // Include existing Brand attributes
        },
        {
          model: Category,
          attributes: ["id", "category_name", "category_slug"], // Match defined Category attributes
        },
        {
          model: Size,
          through: { attributes: [] }, // Exclude join table attributes
          as: "sizes", // Use alias defined in association
          attributes: ["id", "size"], // Match defined Size attributes
        },
        {
          model: Color,
          through: { attributes: [] }, // Exclude join table attributes
          as: "colors", // Use alias defined in association
          attributes: ["id", "name", "color_code"], // Match defined Color attributes
        },
        {
          model: ProductTag, // Now ProductTag is associated with Product
          attributes: ["id", "tag"], // Include ProductTag attributes
        },
      ],
    });

    // If no products found
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    // Return all products data with their associated details
    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving products.",
      error: error.message || "An unexpected error occurred.",
    });
  }
}

async function insertDigitalProduct(req, res) {
  // Handle file upload
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images.",
        error: err.message,
      });
    }

    // Parse incoming data
    const data = req.body;

    // Map uploaded images to fields
    const images = req.files || {};
    data.primary_image = images.primary_image
      ? images.primary_image[0].filename
      : null;
    data.image2 = images.image2 ? images.image2[0].filename : null;
    data.image3 = images.image3 ? images.image3[0].filename : null;
    data.image4 = images.image4 ? images.image4[0].filename : null;
    data.image5 = images.image5 ? images.image5[0].filename : null;

    // Convert types
    data.brand_id = parseInt(data.brand_id, 10);
    data.category_id = parseInt(data.category_id, 10);
    data.quantity = parseInt(data.quantity, 10);
    data.price = parseFloat(data.price);
    data.discount = parseFloat(data.discount || 0);
    data.discount_price = parseFloat(data.discount_price || 0);
    data.status = data.status === "true";
    data.featured_product = data.featured_product === "true";
    data.best_selling = data.best_selling === "true";
    data.on_sale = data.on_sale === "true";
    data.new_arrival = data.new_arrival === "true";
    data.product_tags_data = JSON.parse(data.product_tags_data || "[]");

    // Validate request body
    const validationResponse = v.validate(data, productSchema);
    if (validationResponse !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResponse,
      });
    }

    // Set defaults for brand_id and category_id if null or empty
    data.brand_id = data.brand_id || 1;
    data.category_id = data.category_id || 1;

    try {
      // Check if brand_id exists
      const brand = await Brand.findByPk(data.brand_id);
      if (!brand) {
        return res.status(400).json({
          success: false,
          message: "Invalid brand_id. The specified brand does not exist.",
        });
      }

      // Check if category_id exists
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category_id. The specified category does not exist.",
        });
      }

      // Verify product_tags_data and fetch tags
      let tags = [];
      if (data.product_tags_data && data.product_tags_data.length > 0) {
        tags = await ProductTagList.findAll({
          where: { id: data.product_tags_data },
        });
        if (tags.length !== data.product_tags_data.length) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid product tags. Some tags do not exist in the database.",
          });
        }
      }

      // Check if product name already exists
      const existingProduct = await Product.findOne({
        where: { product_name: data.product_name },
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Product name already exists. Please choose another name.",
        });
      }

      // Insert product
      const product = await Product.create({
        product_name: data.product_name,
        product_slug: data.product_slug,
        brand_id: data.brand_id,
        category_id: data.category_id,
        item_tag: data.item_tag,
        quantity: data.quantity,
        price: data.price,
        discount: data.discount,
        discount_price: data.discount_price,
        about: data.about,
        description: data.description,
        shipping_return: data.shipping_return,
        additional_nformation: data.additional_nformation,
        primary_image: data.primary_image,
        image2: data.image2,
        image3: data.image3,
        image4: data.image4,
        image5: data.image5,
        status: data.status,
        featured_product: data.featured_product,
        best_selling: data.best_selling,
        on_sale: data.on_sale,
        new_arrival: data.new_arrival,
        type: true,
        digital_type: data.digital_type,
        digital_link: data.digital_link,
        digital_file: data.digital_file,
        license_name: data.license_name,
        license_key: data.license_key,
        affiliate_link: data.affiliate_link,
      });

      // Handle product tags association
      if (data.product_tags_data && data.product_tags_data.length > 0) {
        const tagPromises = data.product_tags_data.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          return ProductTag.create({
            product_id: product.id,
            tag: tag.name,
          });
        });
        await Promise.all(tagPromises);
      }

      return res.status(201).json({
        success: true,
        message: "Product inserted successfully!",
        product,
      });
    } catch (error) {
      console.error("Error inserting product:", error);
      return res.status(500).json({
        success: false,
        message: "Error inserting product.",
        error: error.message || "An unexpected error occurred.",
      });
    }
  });
}

async function updateDigitalProduct(req, res) {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error uploading images.",
        error: err.message,
      });
    }

    const data = req.body;

    const images = req.files || {};
    if (images.primary_image) {
      data.primary_image = images.primary_image[0].filename;
    }
    if (images.image2) {
      data.image2 = images.image2[0].filename;
    }
    if (images.image3) {
      data.image3 = images.image3[0].filename;
    }
    if (images.image4) {
      data.image4 = images.image4[0].filename;
    }
    if (images.image5) {
      data.image5 = images.image5[0].filename;
    }

    if (data.brand_id) data.brand_id = parseInt(data.brand_id, 10);
    if (data.category_id) data.category_id = parseInt(data.category_id, 10);
    if (data.quantity) data.quantity = parseInt(data.quantity, 10);
    if (data.price) data.price = parseFloat(data.price);
    if (data.discount) data.discount = parseFloat(data.discount);
    if (data.discount_price)
      data.discount_price = parseFloat(data.discount_price);
    if (data.status) data.status = data.status === "true";
    if (data.featured_product)
      data.featured_product = data.featured_product === "true";
    if (data.best_selling) data.best_selling = data.best_selling === "true";
    if (data.on_sale) data.on_sale = data.on_sale === "true";
    if (data.new_arrival) data.new_arrival = data.new_arrival === "true";
    if (data.product_tags_data)
      data.product_tags_data = JSON.parse(data.product_tags_data || "[]");

    const validationResponse = v.validate(data, productSchema);
    if (validationResponse !== true) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validationResponse,
      });
    }

    const productId = parseInt(req.params.id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      if (data.brand_id) {
        const brand = await Brand.findByPk(data.brand_id);
        if (!brand) {
          return res.status(400).json({
            success: false,
            message: "Invalid brand_id. The specified brand does not exist.",
          });
        }
      }

      if (data.category_id) {
        const category = await Category.findByPk(data.category_id);
        if (!category) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid category_id. The specified category does not exist.",
          });
        }
      }

      let tags = [];
      if (data.product_tags_data && data.product_tags_data.length > 0) {
        tags = await ProductTagList.findAll({
          where: { id: data.product_tags_data },
        });
        if (tags.length !== data.product_tags_data.length) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid product tags. Some tags do not exist in the database.",
          });
        }
      }

      await product.update({
        product_name: data.product_name,
        product_slug: data.product_slug,
        brand_id: data.brand_id,
        category_id: data.category_id,
        item_tag: data.item_tag,
        quantity: data.quantity,
        price: data.price,
        discount: data.discount,
        discount_price: data.discount_price,
        about: data.about,
        description: data.description,
        shipping_return: data.shipping_return,
        additional_nformation: data.additional_nformation,
        primary_image: data.primary_image || product.primary_image,
        image2: data.image2 || product.image2,
        image3: data.image3 || product.image3,
        image4: data.image4 || product.image4,
        image5: data.image5 || product.image5,
        status: data.status,
        featured_product: data.featured_product,
        best_selling: data.best_selling,
        on_sale: data.on_sale,
        new_arrival: data.new_arrival,
        type: true,
        digital_type: data.digital_type,
        digital_link: data.digital_link,
        digital_file: data.digital_file,
        license_name: data.license_name,
        license_key: data.license_key,
        affiliate_link: data.affiliate_link,
      });

      if (data.product_tags_data && data.product_tags_data.length > 0) {
        await ProductTag.destroy({ where: { product_id: productId } });

        const tagPromises = data.product_tags_data.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          return ProductTag.create({
            product_id: productId,
            tag: tag.name,
          });
        });
        await Promise.all(tagPromises);
      }

      return res.status(200).json({
        success: true,
        message: "Digital product updated successfully.",
        product,
      });
    } catch (error) {
      console.error("Error updating digital product:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating digital product.",
        error: error.message || "An unexpected error occurred.",
      });
    }
  });
}

async function deletePhysicalProduct(req, res) {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
    });
  }

  try {
    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Delete related records in SizeProduct
    await SizeProduct.destroy({ where: { product_id: productId } });

    // Delete related records in ColorProduct
    await ColorProduct.destroy({ where: { product_id: productId } });

    // Delete related records in ProductTag
    await ProductTag.destroy({ where: { product_id: productId } });

    // Finally, delete the product itself
    await Product.destroy({ where: { id: productId } });

    return res.status(200).json({
      success: true,
      message: "Product and its related data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting product.",
      error: error.message || "An unexpected error occurred.",
    });
  }
}

module.exports = {
  insertPhysicalProduct,
  getPhysicalProductWithDetails,
  getAllPhysicalProducts,
  insertDigitalProduct,
  updateDigitalProduct,
  deletePhysicalProduct,
  updatePhysicalProduct
};
