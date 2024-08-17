

function addProduct(req, res) {

   return res.status(200).json({
        message: "Product added successfully!",
        filename: req.file.filename
    });

}

module.exports = {
    addProduct:addProduct
};