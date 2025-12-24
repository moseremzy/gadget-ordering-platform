<template>
  <div class="container" :style="interactive_store.container_css">

    <OVERLAY />

    <SUCCESSALERTBOX>{{ interactive_store.backend_message }}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{ interactive_store.backend_message }}</ERRORALERTBOX>

    <!-- Side bar -->
    <SIDEBAR />

    <div class="sub_container" :style="interactive_store.sub_container_css">
       
      <HEADER page_name="dashboard" />

      <h1>Account Settings</h1>

      <div class = "grid">

       <div class="contactusform">
        <h2>Edit Details</h2>
        <form action="">
            
            <div class="item3">
            <label for = "email">Email</label>
            <input type="email" placeholder="Email" v-model = "admin_info.email"  id = "email" class="reedonly">
            <p class="err">{{ admin_info_error.email_err }}</p>
            </div>

            <div class="item4">
            <label for = "phone">Phone</label>
            <input type="text" placeholder="Phone No" v-model = "admin_info.phone" id = "phone" class="reedonly">
            <p class="err">{{ admin_info_error.phone_err }}</p>
            </div>

            <div class="item1">
            <label for = "first_name">Service Fee</label>
            <input type = "number" placeholder="Delivery fee" id = "service_fee" v-model = "admin_info.website_info.service_fee" class="reedonly">
            <p class="err">{{ admin_info_error.service_fee_err }}</p>
            </div>

            <button type = "submit" @click.prevent = "updateAdmin"><font-awesome-icon v-if = "spinner"  class="fa-solid fa-spinner fa-spin" id = "spinner" icon="fa-solid fa-spinner"/>Save</button>
            </form>
            </div>


            <!-- CHANGE PASSWORD -->
            <div class="contactusform">
            <h2>Change Password</h2>
            <form action="">

            <div class="item4">
            <label for = "old_password">Old Password</label>
            <input type="text" placeholder="Old Password" v-model = "password.old_password" id = "old_password">
            <p class="err">{{password_error.old_password_err}}</p>
            </div>

            <div class="item4">
            <label for = "password">New Password</label>
            <input type="password" placeholder="New Password" v-model = "password.new_password" id = "new_password">
            <p class="err">{{password_error.new_password_err}}</p>
            </div>

            <div class="item4">
            <label for = "confirm_password">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" v-model = "password.confirm_password" id = "confirm_password" class="reedonly">
            <p class="err">{{password_error.confirm_password_err}}</p>
            </div>

            <button type = "submit" @click.prevent = "update_admin_pass"><font-awesome-icon v-if = "spinner"  class="fa-solid fa-spinner fa-spin" id = "spinner" icon="fa-solid fa-spinner"/>Update Password</button>
            </form>
            </div>

      </div> <!-- CLOSE GRID -->
      

    </div> <!-- SUB_CONTAINER -->
  </div> <!-- CONTAINER -->
</template>

<script setup>
import OVERLAY from "../components/modals/loading_overlay.vue";
import { useInteractiveStore } from '@/stores/interactive'
import { useAdminStore } from '@/stores/admin'
import { useCustomersStore } from '@/stores/customers'
import HEADER from "../components/Header.vue";
import SIDEBAR from "../components/SideBar.vue"; 
import API from "../api"
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'

const interactive_store = useInteractiveStore()

const admin_store = useAdminStore()

const route = useRoute()
const router = useRouter()

let admin_info = reactive({

    ...admin_store.admin,
    
    website_info: admin_store.website_info
  
})
 

let admin_info_error = reactive({
        email_err: "",
        phone_err: "", 
        service_fee_err: "",  
})


let password = reactive({
    old_password: "",
    new_password: "",
    confirm_password: ""
})

let password_error = reactive({
    old_password_err: "",
    new_password_err: "",
    confirm_password_err: ""
})



if (!admin_store.admin_isAuthenticated) { //if user no get session redirect to login

    router.push({ path: "/login" })

}


watch( () => admin_store.admin_isAuthenticated,

  (isAuthenticated) => { //i dey confirm if admin still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_success_alert_box(true)

        setTimeout(() => {

           router.push({ path: "/login" })
            
        }, 1000);

    }
  }, 
);





// /* Hooks */


onUpdated(() => {

    emailvalidated()
    phonevalidated()
    servicefeevalidated()

    old_password_validated()
    new_password_validated()
    confirm_password_validated()

})



function emailvalidated() {
    
    let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (admin_info.email === "") {
    
       admin_info_error.email_err = "Please fill field";
    
    } else if (pattern.test(admin_info.email) === false) {
       
       admin_info_error.email_err = "Invalid email"
    
    } else {
       
       admin_info_error.email_err = ""
      
       return true;
    
    }
}



function phonevalidated() {
    
    let pattern = /^[0-9]*$/
    
    let phone_length = admin_info.phone.length;
    
    if (admin_info.phone === "") {
    
        admin_info_error.phone_err = "Please fill field";
    
    } else if (pattern.test(admin_info.phone) === false) {
    
        admin_info_error.phone_err = "Invalid phone number";
    
    } else if (phone_length > 11) {
    
        admin_info_error.phone_err = "Cannot be 12 digits long"
    
    } else {
        
        admin_info_error.phone_err = ""
        
        return true

    }         
}




function servicefeevalidated() {
    
    if (admin_info.website_info.service_fee === "") {
    
        admin_info_error.service_fee_err = "Please fill field";
    
    } else {
        
        admin_info_error.service_fee_err = ""
        
        return true

    }         
}



function old_password_validated() {

    if (password.old_password === "") {
       
       password_error.old_password_err = "Please fill field"
    
    } else {
    
       password_error.old_password_err = ""
    
       return true;
    
    }
}

function new_password_validated() {

    let pass_length = password.new_password.length;
    
    if (password.new_password === "") {
    
      password_error.new_password_err = "Please fill field";
    
    } else if (pass_length < 7 || pass_length > 15) {
    
      password_error.new_password_err = "Must be between 7 and 15 characters long"
    
    } else {
    
      password_error.new_password_err = ""
    
      return true;  
    
    }
}



function confirm_password_validated() {
    
    if (password.confirm_password === "") {
    
      password_error.confirm_password_err = "Please fill field";
    
    } else if (password.confirm_password !== password.new_password) {
    
     password_error.confirm_password_err = "Must match new password"
    
    } else {
     
     password_error.confirm_password_err = ""
     
     return true;
        
    }
}



async function updateAdmin(e) {

    if (emailvalidated() && phonevalidated() && servicefeevalidated()) {

        interactive_store.toggle_loading_overlay(true)

        const response = await API.update_admin_info(admin_info);

        if (response.message === "success") {

        interactive_store.backend_message = "Your profile was updated succesfully"
        
        interactive_store.display_success_alert_box()
        
        } else {

        interactive_store.backend_message = "Error occured, please try again"
        
        interactive_store.display_error_alert_box()

        }

        interactive_store.toggle_loading_overlay(false)
        
    }  

}




async function update_admin_pass(e) {

    if (old_password_validated() && new_password_validated() && confirm_password_validated()) {

        interactive_store.toggle_loading_overlay(true)

        const response = await API.update_admin_pass(password);

        if (response.message === "Updated") {
        
        interactive_store.backend_message = "Password Updated"
        
        interactive_store.display_success_alert_box()

        password.old_password = ""
        
        password.new_password = ""
            
        password.confirm_password = ""
        
        } else if (response.message === "Old password incorrect") {

        interactive_store.backend_message = "Old password is Incorrect"
        
        interactive_store.display_error_alert_box()

        password.old_password = ""
        
        password.new_password = ""
            
        password.confirm_password = ""
            
        } else {

        interactive_store.backend_message = "Error occured, please try again"
        
        interactive_store.display_error_alert_box()

        password.old_password = ""
        
        password.new_password = ""
            
        password.confirm_password = ""

        }

        interactive_store.toggle_loading_overlay(false)
        
    }  

}



</script>

<style scoped>
/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
  body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif;
    background-color: rgb(225, 230, 231);
  }
  div.container {
    display: flex;
    height: auto;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  div.sub_container {
    display: block;
    margin: 0;
    padding: 0 15px 90px 15px;
    width: 100%;
  }
  div.sub_container h1 {
    margin: 0px auto 25px auto;
    color: #0e2e45;
    font-size: 3rem;
    font-weight: 300;
  }

     div.contactusform {
        margin: 50px 0 80px 0;
        border-radius: 12px;
        padding: 20px 25px;
        border: 1px solid gray;
    }

    div.contactusform h2 {
      font-size: 18px;
    }

    div.contactusform form {
        margin-top: 20px;
        display: block;
        width: 100%
    }

    div.contactusform label{
       display: block;
       font-size: 15px;
       margin: 14px 0 8px 0;
       color: gray;
    }

    div.contactusform form input, button {
        display: block;
        border: 1px solid gray;
        outline: 0 solid gray;
        border-radius: 6px;
        font-size: 14px;
        padding: 10px 10px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 3px;
    }

    div.contactusform form input:hover {
        border: 1px solid gray;
        outline: 0 solid gray;
    }

    div.contactusform form input:active {
        outline: 0 solid gray;
    }

    div.contactusform form button[type=submit] {
        background-color: green;
        cursor: pointer;
        color: #fff;
        transition: .5s;
        font-weight: bold;
        margin: 20px 0px;
    }

    div.contactusform form button[type=submit]:hover {
        opacity: .5
    }

    div.contactusform form button[type=submit]:disabled {
        opacity: .5;
        cursor: none;
    }

    p.err {
     color: red;
     font-size: 11px;
     margin: 0;
  }
}
/* MOBILE VIEW */
 
/* DESKTOP VIEW */
@media only screen and (min-width: 992px) {
  body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif;
    background-color: rgb(225, 230, 231);
  }
  div.container {
    display: flex;
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  div.sub_container {
    display: block;
    margin: 0 0 0 250px;
    height: 100vh;
    padding: 0 15px 90px 15px;
    width: 100%;
    overflow-y: auto;
    width: calc(100% - 250px);
  }
  div.sub_container h1 {
    margin: 0px auto 25px auto;
    color: #0e2e45;
    font-size: 35px;
    font-weight: 300;
  }

  div.grid {
      display: grid;
      column-gap: 30px;
      grid-template-columns: auto auto;
      align-items: flex-start;
  }

   div.contactusform {
      margin: 30px 0 80px 0;
      box-sizing: border-box;
      border-radius: 12px;
      padding: 20px 20px;
      border: 1px solid gray;
   }

    div.contactusform h2 {
      font-size: 20px;
    }

    div.contactusform form {
        margin-top: 20px;
        display: block;
        width: 100%
    }

    div.contactusform {
        display: block;
    }

    div.contactusform label{
       display: block;
       margin: 14px 0 8px 0;
       font-size: 15px;
       color: gray;
    }

    div.contactusform form input, button {
        display: block;
        border: 1px solid gray;
        outline: 0 solid gray;
        border-radius: 6px;
        font-size: 14px;
        padding: 10px 10px;
        width: 100%;
        box-sizing: border-box;
        margin-bottom: 3px;
    }

    div.contactusform form input:hover {
        border: 1px solid gray;
        outline: 0 solid gray;
    }

    div.contactusform form input:active {
        outline: 0 solid gray;
    }

    div.contactusform form textarea {
        border: 1px solid gray;
        outline: 0 solid gray;
        font-size: 15px;
        width: 100%;
        height: 160px;
        border-radius: 3px;
        margin-top: 10px;
        padding: 10px 11px 0 11px;
        resize: none;
        box-sizing: border-box
    }

    div.contactusform form button[type=submit] {
        background-color: green;
        cursor: pointer;
        color: #fff;
        display: block;
        margin: 20px auto;
        width: 50%;
        font-size: 16px;
        transition: .5s
    }

    div.contactusform form button[type=submit]:hover {
        opacity: .5
    }

    div.contactusform form button[type=submit]:disabled {
        opacity: .5;
        cursor: none;
    }
  
    p.err {
        color: red;
        font-size: 11px;
        margin: 0;
    }
}
/* DESKTOP VIEW */
</style>
