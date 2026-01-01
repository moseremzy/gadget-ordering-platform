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
    <h1>Congratulations! Your order with reference <strong>{{route.query.reference}}</strong> has been placed.</h1>
    <h3>{{confirmation_pin}}</h3>
    <router-link to = "/" id = "link">return home</router-link>
    </div>

    </div>

<WHATSAPP/>

 <FOOTER/>

 </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HEADER from "@/components/Header.vue"
import FOOTER from "@/components/Footer.vue"
import SEARCHRESULT from "@/components/SearchResult.vue"
import SIDEBAR from "@/components/Sidebar.vue"
import WHATSAPP from "@/components/Whatsapp.vue"
import MIDDLEWARES from "../middlewares/middlewares"
import { useUserStore } from '@/stores/user'
import { useOrdersStore } from '@/stores/orders'
import { useProductStore } from '@/stores/products'
import API from '../api/index'

const route = useRoute()
const router = useRouter()

const user_store = useUserStore()
const orders_store = useOrdersStore()
const products_store = useProductStore()

const loading = ref(true)
const error = ref(null)
const confirmation_pin = ref('')
const payment_status = ref('')
const reference = ref('')

const MAX_RETRIES = 5
const RETRY_DELAY = 5000 // 5 seconds

let retryCount = 0

// Auth watcher (kept)
watch(() => user_store.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated) {
    router.push('/login')
  }
})



async function confirmPayment() {

  reference.value = route.query.reference

  if (!reference.value) {
    
    error.value = 'Invalid payment reference'
    
    loading.value = false
    
    return
  
  }

  try {
    
    const res = await API.verify_payment({reference: reference.value})

    payment_status.value = res.payment_status ?? 'unknown'

    if (payment_status.value === 'success') {
      
      confirmation_pin.value = res.confirmation_pin

      localStorage.setItem('cart_products', JSON.stringify([]))
      
      products_store.cart = []

      return // stop retries
    
    }

    if (payment_status.value === 'failed') {
      
      error.value = res.data.message || 'Payment failed'
      
      return // stop retries
    
    }

    //pending → retry
    if (payment_status.value === 'pending') {
      
      if (retryCount < MAX_RETRIES) {
        
        retryCount++
        
        setTimeout(confirmPayment, RETRY_DELAY)
      
      } else {
        
        error.value = 'Payment is taking longer than expected. Please refresh later.'
      
      }
    
    }

  } catch (err) {
    
    error.value = 'Unable to confirm payment at the moment'
  
  } finally {

    loading.value = false
    
    await orders_store.fetch_orders()
  
  }

}


onMounted(() => {

  confirmPayment()
  
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