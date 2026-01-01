<template>
  <div class = "home_container">
  <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
  <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
  <div id="body" class="email_confirmation_container">    
   <font-awesome-icon class="remove fa-solid fa-circle-check" id="check" icon="fa-solid fa-circle-check"/>
  <h1>{{interactive_store.backend_message}}</h1>
  <p>You can now sign in your new account.</p>
  <a href="/login" class="" id="loginbtn">Log in</a>
  </div>
  </div>
</template>
 
<script setup>
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API from "../api/index.js";
import { useInteractiveStore } from '@/stores/interactive'
const interactive_store = useInteractiveStore()


const route = useRoute()
const router = useRouter()
 

onMounted(async () => {

    try {

       const response = await API.emailVerification(route.params.id);
    
       interactive_store.backend_message = response.message  

       interactive_store.display_success_alert_box()

    } catch (error) {

       if (error.response?.data?.message === "Email Verification Failed") {

        router.push({name: "dashboard"})

       }
        
    }
      
})

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

div.email_confirmation_container {
    width: 500px;
    height: 100vh;
    margin: 20px auto 0 auto;
    text-align: center;
    padding: 20px
}

#check {
    background-color: #92be92;
    padding: 20px;
    font-size: 30px;
    color: green;
    border-radius: 50%
}

div.email_confirmation_container h1 {
    margin: 20px 0 20px 0;
    font-size: 30px
}

div.email_confirmation_container p {
    font-size: 16px;
    margin: 20px 0 27px 0
}

div.email_confirmation_container h3 {
    font-size: 13px;
    margin: 30px 0 2px 0
}

#loginbtn {
    cursor: pointer;
    padding: 9px 12px;
    border-radius: 5px;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    border: 1px solid green;
    background-color: green;
    margin-top: 10px
}

@media only screen and (max-width: 612px) {
  div.email_confirmation_container {
      width: 80%;
  }
}
</style>