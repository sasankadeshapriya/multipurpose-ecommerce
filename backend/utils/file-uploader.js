const multer = require("multer");
const path = require("path");

const dynamicStorage = (folder) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const basePath = "./uploads";
      const finalPath = path.join(basePath, folder);
      cb(null, finalPath);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() + path.extname(file.originalname));
    },
  });

const fileFilter = (req, file, cb) => {
  const filetypes = /zip|rar/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type, only ZIP and RAR are allowed"));
  }
};

const getUploader = (folder) =>
  multer({
    storage: dynamicStorage(folder),
    limits: {
      fileSize: 1024 * 1024 * 5, // Set max file size to 5MB
    },
    fileFilter: fileFilter,
  });

module.exports = {
  getFileUploader: getUploader,
};
