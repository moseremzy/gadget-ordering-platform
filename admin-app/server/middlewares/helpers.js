const multer = require("multer");
const path = require("path");
const axios = require("axios");
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_API_KEY;

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


    // Check Stock Availability
    static stock_availability(products) {

      let out_of_stock = "";

      let slightly_available = "";

      const result = products.filter(item =>
        
        item.quantity > item.stock_quantity
      
      );

      if (result.length === 0) {
        
        return null; // no problem
      
      }

      result.forEach(item => {
        
        if (item.stock_quantity === 0) {
          
          out_of_stock += `${item.name}, `;
        
        } else {
          
          slightly_available += `${item.name}, `;
        
        }
      
      });

      let message = "";

      if (out_of_stock) {
        
        message += out_of_stock + "are out of stock. ";
      
      }

      if (slightly_available) {
        
        message += slightly_available + "available but not in this quantity.";
      
      }

      return message;

    }


    static async refundPayment(req, res, reference) {
      
      const payload = {
      
        transaction: reference
      
      };

      try {
        
      const response = await axios.post(
        "https://api.paystack.co/refund",
        payload,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.status == false) {
        return res.status(500).json({
          success: false,
          message: "could not process refund. please try again",
        }); 
      }
    
      return response.data;

      } catch (error) {

        return res.status(500).json({
          success: false,
          message: "could not process refund. please try again",
        }); 
    }

  }
              
}
    