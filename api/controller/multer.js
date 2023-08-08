//Parses Form Data including images
const multer = require("multer");

// Adding Storage and Filename to Multer for Storing Images
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    callback(null, timestamp + file.originalname);
  },
});

// Putting Limits on File Acceptance
const limits = {
  fileSize: 1024 * 1024 * 5,
};

// Filtering file types
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Image Type Not Supported"), false);
  }
};

// Multer middleware for handling file uploads with specific options
const upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});

// Exporting the Upload Module in Products File
module.exports = upload;
