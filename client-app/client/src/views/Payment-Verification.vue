<template>

 <div>

   <HEADER/> 

   <SEARCHRESULT/>

   <SIDEBAR/> 

   <div class = "order_container">

    <div class = 'order_modal' v-if = "loading"> <!-- LOADING MODAL -->
    <p>Verifying Payment...</p>
    <p><strong>Do Not Close This Page</strong></p>
    </div>


    <div class = 'order_modal' v-else-if = "error"> <!-- IF PAYMENT IS FAILS -->
    <font-awesome-icon class="fa-solid fa-xmark" id = "xmark" icon="fa-solid fa-xmark"/>
    <h1 style = "color: red;">We Could Not Verify Your Payment</h1>
    <p>{{error}}</p>
    <router-link to = "/" id = "link">return home</router-link>
    </div>
    

    <div class = 'order_modal' v-else> <!-- IF PAYMENT IS SUCCESSFULL -->
    <font-awesome-icon class="fa-solid fa-circle-check" id = "icon" icon="fa-solid fa-circle-check"/>
    <h1>Congratulations! Your order with ID <strong>{{transactionId}}</strong> has been placed</h1>
    <p>Please keep your confirmation pin safe. You will be asked for it, when your order arrives.</p>
    <h3>{{confirmation_pin}}</h3>
    <router-link to = "/" id = "link">return home</router-link>
    </div>

    </div>

<WHATSAPP/>

 <FOOTER/>

 </div>
</template>

<script setup>
import HEADER from "@/components/Header.vue";
import FOOTER from "@/components/Footer.vue";
import SEARCHRESULT from "@/components/SearchResult.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MIDDLEWARES from "../middlewares/middlewares"
import { useInteractiveStore } from '@/stores/interactive'
import { useUserStore } from '@/stores/user'
import { useOrdersStore } from '@/stores/orders'
import { useProductStore } from '@/stores/products'
import API from '../api'

const interactive_store = useInteractiveStore()
const user_store = useUserStore()
const orders_store = useOrdersStore()
const products_store = useProductStore()

const route = useRoute()
const router = useRouter()


//Reactive variables
const loading = ref(true);
const error = ref(null);
const message = ref("");
const transactionId = ref("");
const confirmation_pin = ref("");

if (!user_store.isAuthenticated) { //if user no get session redirect to login

    interactive_store.set_page_to_go('order-complete')

    router.push({ name: "login" })

}

watch( () => user_store.isAuthenticated,

  (isAuthenticated) => { //i dey confirm if user still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_success_alert_box(true)

        setTimeout(() => {

           router.push({ path: "/login" })
            
        }, 1000);

    }
  }, 
);



// Function to verify payment
const verifyPayment = async (reference) => {
  
  try {

    if (route.query.type == 'cash') { //if na cash on delivery no need for all this paystack check just confirm am immediately

       error.value = false
      
       loading.value = false
       
       return
    
    }
    
    const response = await API.verify_payment(reference);

    transactionId.value = response.data.reference; // Transaction reference

    confirmation_pin.value = response.data.metadata.confirmation_pin //confirmation pin

    localStorage.setItem('cart_products', JSON.stringify([])); //empty cart for localstorage

    products_store.cart = [] //empty cart products for store

  } catch (err) {

    error.value = "Failed to verify payment. Please contact support.";

  } finally {

    loading.value = false;

    await orders_store.fetch_orders() //refetch orders

  }

};


/* Hooks */

onMounted(() => { // Hook to extract reference from the URL and verify payment

    const urlParams = new URLSearchParams(window.location.search);

    const reference = urlParams.get("reference");

    const type = urlParams.get("type");

    const confirmation_code = urlParams.get("confirmation_pin");

    if (reference && type) { //na be say na cash on delivery. payment verification no neccessary.

    error.value = null;

    loading.value = false;

    transactionId.value = reference;

    confirmation_pin.value = confirmation_code;

    } else {

    if (reference) {

    verifyPayment(reference);
        
    } else {

    error.value = "Invalid payment reference.";

    loading.value = false;

    }

    }

    MIDDLEWARES.allowScroll()
    
})


onUpdated(() => {

    MIDDLEWARES.allowScroll()
    
})

</script>

<style scoped>
/* MOBILE DEVICES */
@media only screen and (max-width: 765px) {
  * {
      font-family: 'Nuosu SIL';
      margin: 0;
      padding: 0;
  }

  div.order_container {
    width: 95%;
    margin: 170px auto;
  }
  
div.order_modal {
    text-align: center;
    margin: 10px auto 20px auto;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);
    padding: 30px;
    width: 90%;
    font-size: 18px;
    transition: .3s;
}
div.order_modal #icon{
    background-color: white;
    color: green;
    border-radius: 50%;
    font-size: 80px;
}
div.order_modal #xmark{
    background-color: white;
    color: red;
    border-radius: 50%;
    font-size: 80px;
}
div.order_modal h1{
    font-weight: bold;
    margin: 10px 0;
    font-size: 23px;
    word-wrap: break-word;
    color: green;
}
div.order_modal h3{
    text-align: center;
    font-weight: bold;
    margin: 10px 0;
    font-size: 20px;
    letter-spacing: 5px;
    color: rgb(10, 10, 10);
}
#link {
    font-size: 15px;
    background-color: rgb(6, 109, 6);
    color: white;
    text-decoration: none;
    display: inline-block;
    margin: 20px 0 10px 0;
    padding: 5px 10px;
    border-radius: 7px;
}
}

/* DESKTOP */
@media only screen and (min-width: 765px) {
  * {
      font-family: 'Nuosu SIL';
      margin: 0;
      padding: 0;
  }

  div.order_container {
    width: 95%;
    margin: 170px auto;
  }
  
div.order_modal {
    text-align: center;
    margin: 10px auto 20px auto;
    border-radius: 7px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);
    padding: 30px;
    width: 500px;
    font-size: 18px;
    transition: .3s;
}
div.order_modal #icon{
    background-color: white;
    color: green;
    border-radius: 50%;
    font-size: 80px;
}
div.order_modal #xmark{
    background-color: white;
    color: red;
    border-radius: 50%;
    font-size: 80px;
}
div.order_modal h1{
    font-weight: bold;
    margin: 10px 0;
    font-size: 23px;
    word-wrap: break-word;
    color: green;
}
div.order_modal h3{
    text-align: center;
    font-weight: bold;
    margin: 10px 0;
    font-size: 20px;
    letter-spacing: 5px;
    color: rgb(10, 10, 10);
}
#link {
    font-size: 15px;
    background-color: rgb(6, 109, 6);
    color: white;
    text-decoration: none;
    display: inline-block;
    margin: 20px 0 10px 0;
    padding: 5px 10px;
    border-radius: 7px;
}
}
</style>