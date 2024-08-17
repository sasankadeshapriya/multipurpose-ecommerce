const express = require('express');
const router = express.Router();
const { getUploader } = require('../utils/file-uploader');

router.post('/upload/:folder', (req, res) => {
    const folder = req.params.folder;
    const upload = getUploader(folder).single('file');

    upload(req, res, function (error) {
        if (error) {
            res.status(500).json({
                message: "Error uploading file",
                error: error.message
            });
        } else if (req.file) {
            res.status(200).json({
                message: "File uploaded successfully!",
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
