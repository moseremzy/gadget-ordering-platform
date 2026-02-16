const express = require("express")
const router = express.Router();
const API = require("../api/api")
const Uri = process.env.URI
const check_admin_session = require("../middlewares/check_admin_session.js") 
const req = require("express/lib/request");
const sessionConfig = require("../middlewares/session");
const session = require("express-session");
const HELPERS = require("../middlewares/helpers")
const path = require("path")


router.use(session(sessionConfig));
  


//GET REQUESTS 

router.get("/confirm-email/:id", API.emailVerification);

router.get("/fetch_admin", check_admin_session,  API.fetch_admin);

router.get("/fetch_products", check_admin_session, API.fetch_products);

router.get("/fetch_customers", check_admin_session, API.fetch_customers);

router.get("/fetch_categories", check_admin_session, API.fetch_categories);

router.get("/fetch_settings", check_admin_session,  API.fetch_settings);

router.get("/fetch_orders", check_admin_session,  API.fetch_orders);

router.get("/logout", API.logout);

 
// POST REQUEST

router.post("/register", API.register)

router.post("/resend-email-confirmation", API.ResendConfirmationMail)

router.post("/login", API.login)

router.post("/cancel_order", check_admin_session, API.cancel_order)

router.post("/confirm_order", check_admin_session, API.confirm_order)

router.post("/retry_refund", check_admin_session, API.retry_refund)

router.post("/upload_items", check_admin_session, HELPERS.handleUpload, API.upload_items);
  
router.post("/update_photo", check_admin_session, HELPERS.handleUpload, API.update_photo);

router.post("/update_video", check_admin_session, HELPERS.handleUpload, API.update_video);

router.post("/send_reset_pass_email", API.send_reset_pass_email);

router.post("/reset_password", API.reset_password);
 

//PATCH REQUEST

router.patch("/update_order_status", check_admin_session, API.update_order_status)

router.patch("/update_payment_status", check_admin_session, API.update_payment_status)

router.patch("/update_item", check_admin_session, API.update_item)

router.patch("/update_admin_info", check_admin_session, API.update_admin_info)

router.patch("/update_admin_pass", check_admin_session, API.update_admin_pass)




//DELETE REQUEST

router.delete("/delete_video", check_admin_session, API.delete_video)

module.exports = router