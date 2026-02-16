import api from "./axios";

export default class API {
    
  // POST

  //register
  static async register(formdata) {
    return api.post("/register", formdata).then(res => res.data);
  }

  //resend confirmation email
  static async ResendConfirmationMail(info) {
    return api.post('/resend-email-confirmation', info)
  }
  

  //login
  static async login(formdata) {
    return api.post("/login", formdata).then(res => res.data);
  }

  //submit order
  static async submit_order(info) {
    return api.post("/submit_order", info).then(res => res.data);
  }

  //contact us email
  static async contact_us(info) {
    return api.post("/contact_us", info).then(res => res.data);  
  }

  //send reset password email to user
  static async send_reset_pass_email(info) {
    return api.post("/send_reset_pass_email", info).then(res => res.data);
  }

  //Reset password
  static async reset_password(info) {
    return api.post("/reset_password", info).then(res => res.data)
  }

  //upload items
  static async upload_items(info) {
    return await api.post("/upload_items", info)
  }

  //update item photo
  static async update_photo(info) {
    return await api.post("/update_photo", info)
  }

   //update item video
  static async update_video(info) {
    return await api.post("/update_video", info)
  }
  
  //cancel order
  static async cancel_order(info) {
    return await api.post("/cancel_order", info)
  }

  //confirm order
  static async confirm_order(info) {
    return await api.post("/confirm_order", info)
  }

  //retry initiating refund for user order
  static async retry_refund(info) {
    return await api.post("/retry_refund", info)
  }

  // GET

  //Verify Email
   static async emailVerification(id) {
    return api.get(`/confirm-email/${id}`).then(res => res.data);
  }

  static async fetch_admin() {
    return api.get("/fetch_admin").then(res => res.data);
  }

  static async fetch_customers() {
    return api.get("/fetch_customers").then(res => res.data);
  }


  static async fetch_products() {
    return api.get("/fetch_products").then(res => res.data);
  }

  static async fetch_categories() {
    return api.get("/fetch_categories").then(res => res.data);
  }

  static async fetch_orders() {
    return api.get("/fetch_orders").then(res => res.data);
  }

  static async fetch_settings() {
    return api.get("/fetch_settings").then(res => res.data);
  }

  static async logout() {
    return api.get("/logout").then(res => res.data);
  }

  // PATCH
  static async update_item(info) {
    return api.patch("/update_item", info).then(res => res.data)
  }

  static async update_admin_info(info) {
    return api.patch("/update_admin_info", info).then(res => res.data);
  }

  static async update_order_status(info) {
    return api.patch("/update_order_status", info).then(res => res.data);
  }

  static async update_payment_status(info) {
    return api.patch("/update_payment_status", info).then(res => res.data);
  }

  static async update_address(info) {
    return api.patch("/update_address", info).then(res => res.data);
  }

  static async update_admin_pass(info) {
    return api.patch("/update_admin_pass", info).then(res => res.data);
  }

  //DELETE
  static async delete_video(info) {
    return api.delete("/delete_video", info).then(res => res.data)
  }

}
