import api from "./axios";

export default class API {
    
  // POST

  //register
  static async register(formdata) {
    return api.post("/api/register", formdata).then(res => res.data);
  }

  //login
  static async login(formdata) {
    return api.post("/api/login", formdata).then(res => res.data);
  }

  //submit order
  static async submit_order(info) {
    return api.post("/api/submit_order", info).then(res => res.data);
  }

  //contact us email
  static async contact_us(info) {
    return api.post("/api/contact_us", info).then(res => res.data);  
  }

  //send reset password email to user
  static async send_reset_pass_email(info) {
    return api.post("/api/send_reset_pass_email", info).then(res => res.data);
  }

  //Reset password
  static async reset_password(info) {
    return api.post("/api/reset_password", info).then(res => res.data)
  }

  //upload items
  static async upload_items(info) {
    return await api.post("/api/upload_items", info)
  }

  //update item photo
  static async update_photo(info) {
    return await api.post("/api/update_photo", info)
  }

  // GET

  //Verify Email
  static async emailVerification(id) {
    return api.get(`/api/confirm-email/${id}`).then(res => res.data);
  }

  static async fetch_admin() {
    return api.get("/api/fetch_admin").then(res => res.data);
  }

  static async fetch_customers() {
    return api.get("/api/fetch_customers").then(res => res.data);
  }


  static async fetch_products() {
    return api.get("/api/fetch_products").then(res => res.data);
  }

  static async fetch_categories() {
    return api.get("/api/fetch_categories").then(res => res.data);
  }

  static async fetch_orders() {
    return api.get("/api/fetch_orders").then(res => res.data);
  }

  static async fetch_settings() {
    return api.get("/api/fetch_settings").then(res => res.data);
  }

  static async logout() {
    return api.get("/api/logout").then(res => res.data);
  }

  // PATCH
  static async update_item(info) {
    return api.patch("/api/update_item", info).then(res => res.data)
  }

  static async update_user_info(info) {
    return api.patch("/api/update_user_info", info).then(res => res.data);
  }

  static async update_address(info) {
    return api.patch("/api/update_address", info).then(res => res.data);
  }

  static async update_password(info) {
    return api.patch("/api/update_password", info).then(res => res.data);
  }

}
