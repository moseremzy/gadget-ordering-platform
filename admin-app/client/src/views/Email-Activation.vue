<template>
  <div class = "home_container">
  <LoadingOverlay/> 
  <div class = "email_activation_container">
    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
        <font-awesome-icon  class="remove fa-solid fa-envelope" id="envelope" icon="fa-solid fa-envelope"/>
        <h1>Please verify your email</h1>
        <p>You're almost there! We sent an email to</p>
        <b>{{route.query.confirmationEmail}}</b>
        <p>Just click on the link in that email to complete your signup. If you don't see it, you may need to <b>Check your spam</b> folder.</p>
        <p>Still can't find the email? No problem.</p>
        <button id="btn" @click.prevent = "send_confirmation_mail" :disabled = "disablebtn">Resend Verification Email <font-awesome-icon v-if = "spinner" class="remove fa-solid fa-spinner fa-spin" id="spinner" icon="fa-solid fa-spinner"/></button>
        </div>
  </div>
</template>
 
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingOverlay from "../components/modals/loading_overlay.vue";
import API from "../api/index.js";
import { useInteractiveStore } from '@/stores/interactive'
const interactive_store = useInteractiveStore()


const route = useRoute()
const router = useRouter()


async function send_confirmation_mail() {

    interactive_store.toggle_loading_overlay(true)

    try {

    const response = await API.ResendConfirmationMail({ confirmationEmail: route.query.confirmationEmail});

    console.log(response)

    interactive_store.backend_message = response.data?.message  

    interactive_store.toggle_loading_overlay(false)

    interactive_store.display_success_alert_box()

    } catch (error) {
     
       console.log(error)
     
    }
}
 

</script>


<style scoped>

* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

div.home_container {
    margin: 0px;
    padding: 20px;
    color: white;
    background-color: var(--primary-black);
}

div.email_activation_container {
    width: 500px;
    height: 100vh;
    margin: 0px auto 0 auto;
    text-align: center;
    padding: 20px
}

#envelope {
    background-color: #92be92;
    padding: 20px;
    font-size: 30px;
    color: green;
    border-radius: 50%
}

div.email_activation_container h1 {
    margin: 20px 0 20px 0;
    font-size: 30px
}

div.email_activation_container p {
    font-size: 16px;
    margin: 22px 0 0 0;
    line-height: 30px
}

div.email_activation_container b {
    font-size: 16px;
}

div.email_activation_container h3 {
    font-size: 13px;
    margin: 30px 0 2px 0
}

#btn {
    cursor: pointer;
    padding: 10px 12px;
    border-radius: 5px;
    color: #fff;
    font-weight: 700;
    border: 1px solid var(--primary-blue);
    background-color: var(--primary-blue);
    margin-top: 10px
}

#btn:disabled {
    cursor: none;
    opacity: .9
}

@media only screen and (max-width: 612px) {
  div.email_activation_container {
      width: 80%;
  }
}

</style>

 