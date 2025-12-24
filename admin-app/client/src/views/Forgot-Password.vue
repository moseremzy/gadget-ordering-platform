<template>
  <div class="forgot_pass_form" >
  <h1>Forgot Password</h1>
  <p>Enter your email and we'll send you a link to reset your password.</p>

  <div class="validation_msg" v-if = "backend_err" :style = "backend_err ===  'mail sent' ? {'background-color': 'green', 'border': '1px solid green'} : {'background-color': '#b93c3c', 'border': '1px solid #b93c3c'}">
  <p id="validation_msg">{{backend_err}}</p>
  </div>
  <form>
    <input type="email" v-model = "formvalues.email" name="email" id="email" placeholder="Email">
    <small class="err">{{formvalues_err.email_err}}</small>
    <button type="submit" @click.prevent = "SendMail" id="loginbtn" :disabled = "disablebtn"><font-awesome-icon v-if = "spinner"  class="fa-solid fa-spinner fa-spin" id = "spinner" icon="fa-solid fa-spinner"/> Next</button>
    </form>
    </div>
</template>
  
<script setup>
import API from '../api';
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch, nextTick } from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import { useAdminStore } from '@/stores/admin'

const admin_store = useAdminStore()


const route = useRoute()

const router = useRouter()
 

let toggle = ref(false)
let spinner = ref(false)
let disablebtn = ref(false)
let screenwidth = ref(undefined)
let backend_err = ref(false)

let formvalues = reactive({
    email: ""
})

let formvalues_err = reactive({
    email_err: ""
})


if (admin_store.admin_isAuthenticated) { //if user no get session redirect to login

    router.push({ name: "home" })

}


/* hook */

onUpdated(() => {

   emailvalidated()

})

/* hook */

 
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
                
async function SendMail() {
if (emailvalidated()) {
    disablebtn.value = true;
    spinner.value = true;
    const response = await API.send_reset_pass_email(formvalues);

    switch (response.message) {

        case "mail sent":
        backend_err.value = response.message
        disablebtn.value = false
        spinner.value = false
        break;

        case "We cannot find your email":
        backend_err.value = response.message
        disablebtn.value = false
        spinner.value = false
        break;

        case "error occured":
        backend_err.value = response.message
        disablebtn.value = false
        spinner.value = false
        break;
        
    }  

  }
}

</script>

<style scoped>

@media only screen and (min-width: 612px) {
    div#body {
        font-family: 'Roboto Slab';
    }

    div.forgot_pass_form {
        margin: 100px auto 80px auto;
        width: 400px;
        background-color: #fff;
        border-radius: 7px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19)
    }

    div.forgot_pass_form h1 {
        font-size: 18px
    }

    div.forgot_pass_form p {
        font-size: 16px;
        color: #575555
    }

    div.validation_msg {
        display: block;
        box-sizing: border-box;
        width: 200px;
        margin: auto;
        padding: 3px;
        color: #fff;
        font-weight: 700;
        background-color: #b93c3c;
        border: 1px solid #d64545;
        border-radius: 3px
    }

    p#validation_msg {
        transition: 1s;
        font-size: 12px;
        color: #fff;
        margin: 0
    }

    div.forgot_pass_form input {
        border-radius: 7px;
        border: 1px solid rgba(105,127,128,.884);
        padding: 6px 4px;
        display: block;
        margin: 16px auto 0 auto;
        width: 95%;
        box-sizing: border-box;
        font-size: 15px;
        font-family: Cambria,Cochin,Georgia,Times,Times New Roman,serif
    }

    #spinner {
        color: gray
    }

    div.forgot_pass_form button[type=submit] {
        background-color: rgb(70, 165, 70);
        color: #fff;
        border-radius: 7px;
        border: 1px solid rgba(105,127,128,.884);
        padding: 6px 4px;
        display: block;
        margin: 16px auto 17px auto;
        width: 95%;
        box-sizing: border-box;
        font-size: 14px;
        font-family: Cambria,Cochin,Georgia,Times,Times New Roman,serif
    }

    div.forgot_pass_form input:hover {
        border: 1px solid rgba(10,142,146,.884);
        cursor: pointer
    }

    div.forgot_pass_form input:focus {
        outline: 1px solid rgba(10,142,146,.884)
    }

    div.forgot_pass_form button[type=submit]:hover {
        opacity: .9;
        border: 1px solid rgb(70, 165, 70);
        cursor: pointer
    }

    div.forgot_pass_form button[type=submit]:disabled {
        cursor: none;
        opacity: .4
    }

    div.forgot_pass_form a {
        color: rgba(10,142,146,.884);
        font-size: 13px
    }

    div.forgot_pass_form #dont_h_acct {
        font-size: 13px;
        text-align: center
    }

    small {
        color: red;
        margin: 2px 0 0 0;
        font-size: 11px
    }
}

@media only screen and (max-width: 612px) {
    div#body {
        font-family:Open Sans,Gotham,gotham,Tahoma,Geneva,sans-serif
    }

    div.forgot_pass_form {
        margin: 100px auto 80px auto;
        width: 80%;
        background-color: #fff;
        border-radius: 7px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19)
    }

    div.forgot_pass_form h1 {
        font-size: 17px
    }

    div.forgot_pass_form p {
        font-size: 15px;
        color: #575555
    }

    div.validation_msg {
        display: block;
        box-sizing: border-box;
        width: 70%;
        margin: auto;
        padding: 3px;
        color: #fff;
        font-weight: 700;
        background-color: #b93c3c;
        border: 1px solid #d64545;
        border-radius: 3px
    }

    p#validation_msg {
        transition: 1s;
        font-size: 14px;
        color: #fff;
        margin: 0
    }

    div.forgot_pass_form input {
        border-radius: 7px;
        border: 1px solid rgba(105,127,128,.884);
        padding: 6px 4px;
        display: block;
        margin: 16px auto 0 auto;
        width: 95%;
        box-sizing: border-box;
        font-size: 15px;
        font-family: Cambria,Cochin,Georgia,Times,Times New Roman,serif
    }

    #spinner {
        color: gray
    }

    div.forgot_pass_form button[type=submit] {
        background-color: rgb(70, 165, 70);
        color: #fff;
        border-radius: 7px;
        border: 1px solid rgba(105,127,128,.884);
        padding: 6px 4px;
        display: block;
        margin: 16px auto 17px auto;
        width: 95%;
        box-sizing: border-box;
        font-size: 14px;
        font-family: Cambria,Cochin,Georgia,Times,Times New Roman,serif
    }

    div.forgot_pass_form input:hover {
        border: 1px solid rgba(10,142,146,.884);
        cursor: pointer
    }

    div.forgot_pass_form input:focus {
        outline: 1px solid rgba(10,142,146,.884)
    }

    div.forgot_pass_form button[type=submit]:hover {
        opacity: .9;
        border: 1px solid rgb(70, 165, 70);
        cursor: pointer
    }

    div.forgot_pass_form button[type=submit]:disabled {
        cursor: none;
        opacity: .4
    }

    div.forgot_pass_form a {
        color: rgba(10,142,146,.884);
        font-size: 13px
    }

    div.forgot_pass_form #dont_h_acct {
        font-size: 13px;
        text-align: center
    }

    small {
        color: red;
        margin: 2px 0 0 0;
        font-size: 11px
    }
}
</style>