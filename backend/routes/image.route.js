const express = require('express');
const router = express.Router();
const { getUploader } = require('../utils/image-uploader');

router.post('/upload/:folder', (req, res) => {
    // Get the folder from the route parameter
    const folder = req.params.folder;
    // Create an uploader for the specified folder
    const upload = getUploader(folder).single('image');

    upload(req, res, function (error) {
        if (error) {
            res.status(500).json({
                message: "Error uploading image",
                error: error.message
            });
        } else if (req.file) {
            res.status(200).json({
                message: "Image uploaded successfully!",
                filename: req.file.filename
            });
        } else {
            res.status(400).json({
                message: "No file uploaded"
            });
        }
    });
});

module.exports = router;
