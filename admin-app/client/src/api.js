import axios from "axios"
 

export default class API {

    //POST REQUESTS

    //Register
    static async register(formdata) {
        const res = await axios.post("/api/register", formdata)
        return res.data
    }

    //Resend Confirmation Email
    static async ResendConfirmationMail(info) {
        const res = await axios.post('/api/resend-email-confirmation', info)
        return res.data
    }
    

    //Login
    static async login(formdata) {
        const res = await axios.post("/api/login", formdata)
        return res.data
    }



    //cancel order
     static async cancel_order(info) {
        const res = await axios.post("/api/cancel_order", info)
        return res.data
    }


    //confirm order
    static async confirm_order(info) {
        const res = await axios.post("/api/confirm_order", info)
        return res.data
    }


    //send reset password email to user
     static async send_reset_pass_email(info) {
        const res = await axios.post("/api/send_reset_pass_email", info)
        return res.data
     }

    //Reset password
    static async reset_password(info) {
    const res = await axios.post("/api/reset_password", info)
    return res.data
    }


    //upload items
    static async upload_items(info) {
        const res = await axios.post("/api/upload_items", info)
        return res.data
    }

     //update item photo
     static async update_photo(info) {
        const res = await axios.post("/api/update_photo", info)
        return res.data
    }



    
    //GET REQUESTS

    //Verify Email
    static async emailVerification(id) {
        const res = await axios.get(`/api/confirm-email/${id}`)
        return res.data
    }


    //fetch user
    static async fetch_admin() {
        const res = await axios.get(`/api/fetch_admin`)
        return res.data
    }

    //fetch orders
    static async fetch_orders() {
        const res = await axios.get(`/api/fetch_orders`)
        return res.data
    }

    //fetch customers
    static async fetch_customers() {
        const res = await axios.get(`/api/fetch_customers`)
        return res.data
    }


    //fetch customers
    static async fetch_items() {
        const res = await axios.get(`/api/fetch_items`)
        return res.data
    }


    //logout admin
    static async logout() {
        const res = await axios.get("/api/logout");
        return res.data
     }



    //PATCH REQUEST

    //update order status
    static async update_order_status(info) {
        const res = await axios.patch("/api/update_order_status", info)
        return res.data
    }

    //update password
    static async update_password(info) {
        const res = await axios.patch(`/api/update_password`, info)
        return res.data
    }


    //update item
    static async update_item(info) {
        const res = await axios.patch("/api/update_item", info)
        return res.data
    }


    //update admin info
    static async update_admin_info(info) {
        const res = await axios.patch("/api/update_admin_info", info)
        return res.data
    }


    //update admin pass
    static async update_admin_pass(info) {
        const res = await axios.patch("/api/update_admin_pass", info)
        return res.data
    }

    //DELETE REQUESTS

    //delete item
    static async delete_item(item_name) {
        const res = await axios.delete(`/api/delete_item`, item_name)
        return res.data
    }

}