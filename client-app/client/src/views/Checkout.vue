<template>

 <div>

 <OVERLAY/>

 <HEADER/> 
 
 <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

 <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

 <ERRORMODAL>{{interactive_store.backend_message}}</ERRORMODAL>

 <SEARCHRESULT/>

 <SIDEBAR/>

    <div class = "home_container">

    <h1>Checkout</h1>

      <div class = "grid">

      <div class = "section">

      <div class = "item">

        <h2>Delivery Address</h2>
        
        <p v-if = "address_exists" id = "address">{{user_store.user.address}}. {{user_store.user.city}}. {{user_store.user.state}}.</p>
         
        <router-link id = "link" to = "/account/profile">{{ address_exists ? '[ Change Address ]' : '[ Add Address ]'}}</router-link>

      </div> 


      <div class = "item">

        <h2>Select Payment Method</h2>
        
        <form>

        <div>
        <div class = "payment_method" v-if = "settings_store.store_state === user_store.user.state">
        <input type = "radio" id = "cash" v-model = "payment_method" value = "cash on delivery"  name = "payment_method">
        <label for = "cash">Cash On Delivery</label>
        </div>

        <div class = "payment_method" v-else>
        <input type = "radio" id = "card" v-model = "payment_method" value = "online payment" name = "payment_method">
        <label for = "card">Online Payment (Paystack)</label>
        </div> 
        </div>

        </form>

      </div> 


      <div class = "item" style = "border: 0;">

        <div class = "delivery_pin">
            <h1><font-awesome-icon style = "display: inline-block; margin-right: 10px; float: left;"  class="fa-solid fa-exclamation" id = "exclamation" icon="fa-solid fa-exclamation"/> Delivery includes pin confirmation</h1>
            <p>This will help ensure your order is given to the right person.</p>
        </div>

      </div>

      </div> <!-- section1 -->

      

      <div class = "section">

      <div class = "order_summary"> 
          
        <h2>ORDER SUMMARY</h2>

        <hr>

        <h4>PRODUCT <b>SUBTOTAL</b></h4>
        
         <template v-for = "item in products_store.cart_items" :key = "item.name">
         
         <p>{{`${item.name} x ${item.quantity}`}} <b>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.total)}}</b></p>
         
         </template>
        
        <hr>

        <h4>SUBTOTAL: <b>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(products_store.cart_subtotal_amount)}}</b></h4>
         
        <h4>DELIVERY FEE: <b>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(products_store.delivery_fee)}}</b></h4>

        <h4>TOTAL: <b>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(products_store.cart_total_amount)}}</b></h4>

        <hr>

         <button id = "checkout" @click.prevent = "checkout">Make Payment</button>

      </div>

      </div> <!-- section2 -->

   </div> <!-- grid -->

   </div> <!-- CONTAINER -->

   <WHATSAPP/>

 <FOOTER/>

 </div>
</template>

<script setup>
import SEARCHRESULT from "@/components/SearchResult.vue";
import HEADER from "@/components/Header.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import OVERLAY from '../components/modals/loading_overlay.vue';
import FOOTER from "@/components/Footer.vue";
import ERRORMODAL from "../components/modals/ErrorModal.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, computed, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MIDDLEWARES from "../middlewares/middlewares"
import { useUserStore } from '@/stores/user'
import { useInteractiveStore } from '@/stores/interactive'
import API from "../api/index.js";
import { useProductStore } from '@/stores/products' 
import { useOrdersStore } from '@/stores/orders'
import { useSettingStore } from '@/stores/settings'


const products_store = useProductStore()
const user_store = useUserStore()
const interactive_store = useInteractiveStore()
const orders_store = useOrdersStore()
const settings_store = useSettingStore()

const route = useRoute()
const router = useRouter()

let payment_method = ref("")

 
watch( () => user_store.isAuthenticated,

  (isAuthenticated) => { //i dey confirm if user still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_success_alert_box(true)

        setTimeout(() => {

           router.push({ name: "sign-in" })
            
        }, 1000);

    }
  }, 
);



const address_exists = computed(() => { //check if user as entered address
  
  if (!user_store.user.address || !user_store.user.city || !user_store.user.state) {
 
    return false
 
  }

    return true

})


function validateAddress() {

    if (!address_exists.value) {

        interactive_store.backend_message = "Address cannot be empty"

        interactive_store.display_error_alert_box()

        return false

    } else {

        return true

    }
    
}

function validate_payment_method() {

    if (payment_method.value == "") {

        interactive_store.backend_message = "Select Payment Method"

        interactive_store.display_error_alert_box()

        return false

    } else {

        return true

    }
    
}


function validate_products() {

    if (products_store.cart_products.length == 0) {

        interactive_store.backend_message = "No products to Checkout"

        interactive_store.display_error_alert_box()

        return false

    } else {

        return true

    }
    
}



async function checkout() {

    if (validateAddress() && validate_payment_method() && validate_products()) {

        interactive_store.toggle_loading_overlay(true)

        let order = {

            email: `${user_store.user.email}`,

            customer_name: `${user_store.fullname}`,

            phone: `${user_store.user.phone}`,

            payment_method: payment_method.value,

            total_amount: products_store.cart_total_amount,

            total_items: products_store.total_cart_products,

            delivery_fee: products_store.delivery_fee,

            products: JSON.stringify(products_store.cart_products)

        }

       try {

        const response = await API.submit_order(order)

        switch (payment_method.value) {
            
            case 'online payment':

            if (response.authorization_info) { //if na online payment
           
              window.location.replace(response.authorization_info.data.authorization_url);
            
            }
            
            break;

            case 'cash on delivery':

            await orders_store.fetch_orders() //refetch orders

            localStorage.setItem('cart_products', JSON.stringify([])); //empty cart for localstorage

            products_store.cart = [] //empty cart products for store

            router.push('/account/profile')
       
            break;

        }
           
       } catch (error) {

         interactive_store.backend_message = typeof(error.response.data) == 'string' ? error.response.data : error.response?.data?.message

         interactive_store.display_error_modal_box(true)
           
       }

    }

    interactive_store.toggle_loading_overlay(false)

}



</script>

<style scoped>

/* GENERAL STYLES */
* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

div.home_container {
    margin: 0px;
    padding: 20px;
    background-color: var(--primary-black);
}

div.home_container h1{
    margin: 5px 0;
    color: var(--primary-blue);
}

.grid {
    margin-top: 20px;
}

div.item {
    margin: 0px 0px 25px 0;
    background-color: rgb(20, 20, 20);
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    border: 1px solid rgb(201, 199, 199);
}

  div.item h2 {
      font-size: 17px;
      font-weight: bold;
      padding: 12px 20px;
      border-top-right-radius: 12px;
      border-top-left-radius: 12px;
      background-color: #1a1a1a;
      color: var(--primary-blue);
  }

  div.item p {
      color: var(--primary-white);
      font-size: 16px;
      word-break: break-all;
      font-weight: lighter;
      margin: 15px 20px;
  }

  #address {
      font-size: 15px;
  }

  div.item #link {
      color: rgb(209, 56, 56);
      text-decoration: none;
      font-size: 16px;
      display: inline-block;
      cursor: pointer;
      margin: 10px 20px 11px 20px;
  }

  div.payment_method {
      color: var(--primary-white);
      margin: 20px 20px;
  }

  div.payment_method label{
      margin: 0px 10px;
      font-size: 16px;
      font-weight: lighter;
      vertical-align: top;
  }

  div.delivery_pin {
      padding: 20px 10px;
      border-radius: 7px;
      background-color: #1a1a1a;
      border: 1px solid rgb(77, 77, 77);
  }

  div.delivery_pin h1{
      color: var(--primary-blue);
      font-size: 16px !important;
      margin: 5px 20px;
  }

  #exclamation {
      padding: 3px 8px;
      border-radius: 50%;
      color: white;
      background-color: var(--primary-blue);
  }

  hr {
      margin: 10px 0;
  }

  div.order_summary {
      border: 1px solid var(--secondary-white);
      background-color: rgb(20, 20, 20);
      border-radius: 12px;
      padding: 20px;
      margin-top: 0px;
  }

  div.order_summary h2{
      color: var(--primary-blue);
      font-weight: bold;
      font-size: 16px;
  }

  div.order_summary h4{
      font-size: 15px;
      color: var(--primary-white);
      margin: 20px 0px;
      font-weight: bold;
  }

  div.order_summary p{
      font-size: 17px;
      margin: 14px 0px;
      font-weight: lighter;
  }

  div.order_summary b{
      float: right;
      color: rgb(145, 144, 144);
      font-size: 16px;
  }

  button#checkout {
      color: white;
      border: 0;
      padding: 10px;
      display: block;
      width: 60%;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 17px;
      cursor: pointer;
      margin: 40px auto 0px auto;
      background-color: var(--primary-blue);
  }


/* DESKTOP */
@media only screen and (min-width: 800px) {
  div.grid {
      display: grid;
      margin-top: 50px;
      column-gap: 50px;
      align-items: flex-start;
      grid-template-columns: 50% auto;
  }
}

/* MOBILE */
@media only screen and (max-width: 800px) {
  div.home_container h1{
    font-size: var(--container-mobile-font-size);
  }
}
</style>