<template>
<form class="auth-form" @submit.prevent="validation">
<div>
    <div class="input-group">
    <font-awesome-icon
    class="fa-solid fa-user icons"
    @click="interactive_store.toggle_main_nav(true)"
    icon="fa-solid fa-user"
    />
    <input type="text" v-model = "formvalues.fullname" placeholder="Full Name" required />
    <p class = "err">{{formvalues_err.fullname_err}}</p>
    </div>
</div>

<div class="input-group">
    <font-awesome-icon
    class="fa-solid fa-envelope icons"
    @click="interactive_store.toggle_main_nav(true)"
    icon="fa-solid fa-envelope"
    />
    <input type="email" v-model = "formvalues.email" placeholder="Email" required />
    <p class = "err">{{formvalues_err.email_err}}</p>
</div>

<div class="input-group">
    <font-awesome-icon
    class="fa-solid fa-phone icons"
    @click="interactive_store.toggle_main_nav(true)"
    icon="fa-solid fa-phone"
    />
    <input type="tel" v-model = "formvalues.phone" placeholder="Phone Number" required />
    <p class = "err">{{formvalues_err.phone_err}}</p>
</div>

<div class="input-group">
    <font-awesome-icon
    class="fa-solid fa-lock icons"
    @click="interactive_store.toggle_main_nav(true)"
    icon="fa-solid fa-lock"
    />
    <input type="password" v-model = "formvalues.password" placeholder="Password" required />
    <p class = "err">{{formvalues_err.password_err}}</p>
</div>

<div class="input-group">
    <font-awesome-icon
    class="fa-solid fa-lock icons"
    @click="interactive_store.toggle_main_nav(true)"
    icon="fa-solid fa-lock"
    />
    <input type="password" v-model = "formvalues.confirm_password" placeholder="Confirm Password" required />
    <p class = "err">{{formvalues_err.confirm_password_err}}</p>
</div>

<button type="submit" class="submit-btn">
    Sign Up
</button>
</form>
</template>


<script setup>
import SEARCHRESULT from "@/components/SearchResult.vue";
import HEADER from "@/components/Header.vue";
import SUCCESSALERTBOX from "@/components/alert_box/success.vue";
import ERRORALERTBOX from "@/components/alert_box/error.vue";
import FOOTER from "@/components/Footer.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import API from "../api/index.js";
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useInteractiveStore } from '@/stores/interactive'

const user_store = useUserStore()
const interactive_store = useInteractiveStore()
 

const route = useRoute()
const router = useRouter()


let formvalues = reactive({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: ""
})

let formvalues_err = reactive({
    fullname_err: "",
    phone_err: "",
    email_err: "",
    password_err: "",
    confirm_password_err: ""
})


if (user_store.isAuthenticated) { //if user no get session redirect to login

    router.push({ name: "home" })

}



/* Hooks */

onUpdated(() => {

    fullnamevalidated()

    phonevalidated()

    emailvalidated()

    passwordvalidated()

    confirmpasswordvalidated()

})


onMounted(() => {

    MIDDLEWARES.allowScroll()
    
})


onUpdated(() => {

    MIDDLEWARES.allowScroll()
    
})

/* Hook */



function fullnamevalidated() {

    let pattern = /^[A-Za-z ]+$/;

    if (formvalues.fullname === "") {

        formvalues_err.fullname_err = "Please fill field";

    } else if (pattern.test(formvalues.fullname) === false) {

        formvalues_err.fullname_err = "fullname can only contain letters"
    
    } else { 
        
        formvalues_err.fullname_err = ""
    
        return true;
    }
}

function phonevalidated() {
    
    let pattern = /^[0-9]*$/
    
    let phone_length = formvalues.phone.length;
    
    if (formvalues.phone === "") {
    
       formvalues_err.phone_err = "Please fill field";
    
    } else if (pattern.test(formvalues.phone) === false) {
    
       formvalues_err.phone_err = "Invalid phone number";
    
    } else if (phone_length > 11) {
    
       formvalues_err.phone_err = "Cannot be 12 digits long"
    
    } else {
    
       formvalues_err.phone_err = ""
       
       return true;
    
    }
}

function emailvalidated() {

    let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (formvalues.email === "") {
    
       formvalues_err.email_err = "Please fill field";
    
    } else if (pattern.test(formvalues.email) === false) {
       
       formvalues_err.email_err = "Invalid email"
    
    } else {
       
       formvalues_err.email_err = ""
      
       return true;
    
    }
}

function passwordvalidated() {
    
    let pass_length  = formvalues.password.length;
    
    if (formvalues.password === "") {
    
        formvalues_err.password_err = "Please fill field";
    
    } else if (pass_length < 7 || pass_length > 15) {
    
        formvalues_err.password_err = "Must be between 7 and 15 characters long"
    
    } else {
        
        formvalues_err.password_err = ""
    
        return true        
   }

}


function confirmpasswordvalidated() {
    
    if (formvalues.password !== formvalues.confirm_password) {

        formvalues_err.confirm_password_err = "Must correspond with password";      
      
    } else {
        
        formvalues_err.confirm_password_err = ""
    
        return true        
   }

}


async function validation() {
          
    if (fullnamevalidated() && phonevalidated() && emailvalidated() && passwordvalidated() && confirmpasswordvalidated()) {

    interactive_store.toggle_loading_overlay(true)
   
    try {
        
    const response = await API.register(formvalues); 

    interactive_store.toggle_loading_overlay(false)

    return router.push({ name: "email-activation", query: {confirmationEmail: formvalues.email} })
    
    } catch (error) {

    if (error.response?.data?.message === "email already exists") {

    interactive_store.backend_message = error.response.data.message

    interactive_store.display_error_modal_box(true)
    
    }
  }
 }
}
</script>

<style scoped>
/* Input Fields */
.input-group {
  display: flex;
  align-items: center;
  background: #111;
  border-radius: 8px;
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid #333;
}
.input-group .icons {
  margin-right: 10px;
  color: #888;
  font-size: 15px;
}
.input-group input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  width: 100%;
  font-size: 14px;
}

/* Submit Button */
.submit-btn {
  background: var(--primary-blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}
.submit-btn:hover {
  background: var(--primary-blue);
}
p.err {
  color: red;
  margin: 2px 0 0 0;
  font-size: 11px;
  text-align: left;
  padding-left: 10px;
}
</style>

