const express = require("express")
const router = express.Router();
const API = require("../api/api")
const Uri = process.env.URI
const check_user_session = require("../middlewares/check_user_session.js") 
const req = require("express/lib/request");
const sessionConfig = require("../middlewares/session");
const session = require("express-session");


router.use(session(sessionConfig));



//GET REQUESTS 

router.get("/api/confirm-email/:id", API.emailVerification);

router.get("/api/fetch_products", API.fetch_products);

router.get("/api/fetch_categories", API.fetch_categories);

router.get("/api/fetch_settings",  API.fetch_settings);

router.get("/api/fetch_user", check_user_session,  API.fetch_user);

router.get("/api/fetch_orders", check_user_session,  API.fetch_orders);

router.get("/api/verify_payment/:reference", check_user_session,  API.verify_payment);

router.get("/api/logout", API.logout);

 
// POST REQUEST

router.post("/api/register", API.register)

router.post("/api/resend-email-confirmation", API.ResendConfirmationMail)

router.post("/api/login", API.login)

router.post("/api/submit_order", check_user_session, API.submit_order);

router.post("/paystack_webhook", API.paystack_webhook);

router.post("/api/contact_us", API.contact_us);

router.post("/api/send_reset_pass_email", API.send_reset_pass_email);

router.post("/api/reset_password", API.reset_password);
 

//PATCH REQUEST

router.patch("/api/update_user_info", check_user_session, API.update_user_info)

router.patch("/api/update_address", check_user_session, API.update_address)

router.patch("/api/update_password", check_user_session, API.update_password)


module.exports = router