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

router.get("/api/confirm-email/:id", API.emailVerification);

router.get("/api/fetch_admin", check_admin_session,  API.fetch_admin);

router.get("/api/fetch_products", check_admin_session, API.fetch_products);

router.get("/api/fetch_customers", check_admin_session, API.fetch_customers);

router.get("/api/fetch_categories", check_admin_session, API.fetch_categories);

router.get("/api/fetch_settings", check_admin_session,  API.fetch_settings);

router.get("/api/fetch_orders", check_admin_session,  API.fetch_orders);

router.get("/api/logout", API.logout);

 
// POST REQUEST

router.post("/api/register", API.register)

router.post("/api/resend-email-confirmation", API.ResendConfirmationMail)

router.post("/api/login", API.login)

router.post("/api/cancel_order", check_admin_session, API.cancel_order)

router.post("/api/confirm_order", check_admin_session, API.confirm_order)

router.post("/api/upload_items", check_admin_session, HELPERS.handleUpload, API.upload_items);
  
router.post("/api/update_photo", check_admin_session, HELPERS.handleUpload, API.update_photo);

router.post("/api/send_reset_pass_email", API.send_reset_pass_email);

router.post("/api/reset_password", API.reset_password);
 

//PATCH REQUEST

router.patch("/api/update_order_status", check_admin_session, API.update_order_status)

router.patch("/api/update_payment_status", check_admin_session, API.update_payment_status)

router.patch("/api/update_item", check_admin_session, API.update_item)

router.patch("/api/update_admin_info", check_admin_session, API.update_admin_info)

router.patch("/api/update_admin_pass", check_admin_session, API.update_admin_pass)




//DELETE REQUEST

router.delete("/api/delete_item", check_admin_session, API.delete_item)



module.exports = router