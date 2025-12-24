const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../product-images'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg"; // fallback
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});


module.exports = class MIDDLEWARES {

    static handleUpload(req, res, next) {
        upload.single("main_image")(req, res, function (err) {
          if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return res.status(400).json({
                success: false,
                message: "Image must not be larger than 5MB"
              });
            }
      
            return res.status(400).json({
              success: false,
              message: err.message
            });
          }
      
          next();
        });
    }
              
}
    