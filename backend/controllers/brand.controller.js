const { Brand } = require("../models");

function generateSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function addBrand(req, res) {
    const { brand_name } = req.body;
    if (!brand_name) {
        return res.status(400).send({ message: "Brand name is required" });
    }

    const brand_image = req.file ? req.file.filename : null;
    if (!brand_image) {
        return res.status(400).send({ message: "Brand image is required" });
    }

    // Check if brand name already exists
    Brand.findOne({
        where: { brand_name: brand_name }
    }).then(existingBrand => {
        if (existingBrand) {
            return res.status(409).send({ message: "Brand name already exists" });
        }

        const brand_slug = generateSlug(brand_name);
        const status = '1'; // Default status as '1'

        Brand.create({
            brand_name: brand_name,
            brand_slug: brand_slug,
            brand_image: brand_image,
            status: status
        })
        .then(newBrand => {
            res.status(201).send({
                message: "Brand added successfully",
                brand: newBrand
            });
        })
        .catch(error => {
            res.status(500).send({ message: "Server error", error: error.message });
        });
    }).catch(error => {
        res.status(500).send({ message: "Server error", error: error.message });
    });
}

module.exports = {
    addBrand: addBrand
};
