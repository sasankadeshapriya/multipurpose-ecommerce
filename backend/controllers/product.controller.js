const { Product, Brand, Category, Color, Size, ColorProduct, SizeProduct, sequelize } = require('../models');
const { getUploader } = require('../utils/image-uploader');
const Validator = require("fastest-validator");

const v = new Validator();

const productSchema = {
  category_id: { type: "number", positive: true, integer: true },
  brand_id: { type: "number", positive: true, integer: true },
  product_name: { type: "string", min: 2, max: 255 },
  product_slug: { type: "string", custom: (value, errors) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          errors.push({ type: "productSlugInvalid", expected: "Valid Slug", actual: value });
      }
      return value; // return the sanitized value
  }},
  price: { type: "number", positive: true },
  quantity: { type: "number", positive: true, integer: true },
  description: { type: "string", optional: true, max: 500 },
  colors: { type: "array", items: "number", optional: true },
  sizes: { type: "array", items: "number", optional: true },
  image: { type: "string", optional: true }  // This assumes image is passed as a filename string
};

const physicalProductAdd = async (req, res) => {
    const validationResult = v.validate(req.body, productSchema);
    if (Array.isArray(validationResult)) {
        return res.status(400).json({ errors: validationResult });
    }

    const t = await sequelize.transaction();

    try {
        const { category_id, brand_id, product_name, product_slug, price, quantity, description } = req.body;

        const category = await Category.findByPk(category_id, { transaction: t });
        if (!category) {
            await t.rollback();
            return res.status(404).json({ error: "Category not found" });
        }

        const brand = await Brand.findByPk(brand_id, { transaction: t });
        if (!brand) {
            await t.rollback();
            return res.status(404).json({ error: "Brand not found" });
        }

        // Check if the image file has been uploaded
        if (!req.file) {
            await t.rollback();
            return res.status(400).json({ error: "Image upload failed" });
        }

        const newProduct = await Product.create({
            category_id,
            brand_id,
            product_name,
            product_slug,
            price,
            quantity,
            description,
            primary_image: req.file.filename,  // Save the filename provided by multer
            type: 0, // 0 for physical products
            status: true, // Assuming default status is true
        }, { transaction: t });

        // Handle colors and sizes
        if (req.body.colors) {
            await handleColors(req.body.colors, newProduct.id, t);
        }
        if (req.body.sizes) {
            await handleSizes(req.body.sizes, newProduct.id, t);
        }

        await t.commit();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const handleColors = async (colorIds, productId, transaction) => {
    const validColors = await Color.findAll({
        where: { id: colorIds },
        transaction
    });

    if (validColors.length !== colorIds.length) {
        throw new Error('Some requested colors are not available');
    }

    const colorProducts = validColors.map(color => ({
        product_id: productId,
        color_id: color.id
    }));

    await ColorProduct.bulkCreate(colorProducts, { transaction });
};

const handleSizes = async (sizeIds, productId, transaction) => {
    const validSizes = await Size.findAll({
        where: { id: sizeIds },
        transaction
    });

    if (validSizes.length !== sizeIds.length) {
        throw new Error('Some requested sizes are not available');
    }

    const sizeProducts = validSizes.map(size => ({
        product_id: productId,
        size_id: size.id
    }));

    await SizeProduct.bulkCreate(sizeProducts, { transaction });
};


module.exports = {
    physicalProductAdd:physicalProductAdd
};