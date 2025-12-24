<template>

 <div>

 <HEADER/> 

 <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

 <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

 <SEARCHRESULT/>

 <SIDEBAR/>

   <div class = "home_container" v-if = "product[0]" :key = "product[0].product_id">

      <h1>View {{product[0].name}}</h1>

       <div class = "grid">

       <div class = "image"> 

        <img :src="'http://localhost:8082/images/'+product[0].main_image" :alt="product[0].name">

       </div>

       <div class = "info">

        <div class = "spans">
            <Category :product = product[0] />
            <Availability :product = product[0] />
            <Condition :product = product[0] />
        </div>

        <h1 id = "title">{{product[0].name}}</h1>

        <p id = "description">{{product[0].description}}</p>

        <h3>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product[0].price)}}</h3>
        
       <div class="cart-actions">
        <div class="quantity-box">
            <button class="qty-btn" @click = "quantity > 1 ? quantity-- : null">−</button>
            <span class="qty-value">{{quantity}}</span>
            <button class="qty-btn" @click = "quantity++">+</button>
        </div>

        <button class="add-cart-btn" @click = "AddToCart(product[0], quantity)">
            <font-awesome-icon class="fa-solid fa-cart-shopping icons" icon="fa-solid fa-cart-shopping" />
            Add to Cart
        </button>
        </div>
       
       <div class = "cards">
        <div class="card">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield mx-auto mb-3 text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
          <h2>Always Authentic</h2>
          <p>We only sell 100% authentic products</p>
        </div>
        <div class="card">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck mx-auto mb-3 text-primary"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
          <h2>Fast Shipping</h2>
          <p>Receive products in amazing time</p>
        </div>
       
        <div class="card">
          <svg style="color: green;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle mx-auto mb-3 text-whatsapp"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
          <h2>Fast Support</h2>
          <p>Quick customer support</p>
        </div>

        <div class="card">
          <svg
          style="color: green;"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-lock mx-auto mb-3 text-whatsapp"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>

          <h2>Secure Shopping</h2>
          <p>Your data is always protected</p>
        </div>
      </div>

    </div> 

    </div>
    
    <WHATSAPP/>

    <div class = "last_section">

      <div class="auth-container">
      
      <!-- Tabs -->
      <div class="tab-container">
        <button
          class="tab"
          :class="{ active: activeTab === 'description' }"
          @click="activeTab = 'description'"
        >
          Description
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'specification' }"
          @click="activeTab = 'specification'"
        >
          Specification
        </button>
      </div>

     <!-- description -->
      <div class = "tab_info" v-if="activeTab === 'description'">
         <h1>Product Description</h1>
         <p>{{product[0].description}}</p>
         
         <div class = "list">
             <div id = "field">Category</div>
             <div>{{product[0].category_name}}</div>
         </div>

        <div class = "list">
             <div id = "field">Availability</div>
             <div>{{product[0].stock_quantity > 0 ? 'In Stock' : 'Out of Stock' }}</div>
         </div>
      </div>
        
     <!-- Specification -->
      <div class = "tab_info" v-else>
        <h1>Product Information</h1>
         
         <div class = "list">
             <div id = "field">Product Name</div>
             <div>{{product[0].name}}</div>
         </div>

        <div class = "list">
             <div id = "field">Category</div>
             <div>{{product[0].category_name}}</div>
         </div>

         <div class = "list">
             <div id = "field">Price</div>
             <div>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product[0].price)}}</div>
         </div>
      </div>
 
    </div>
    
    </div> 

   </div> <!-- home_container -->

 <FOOTER/>

 </div>
</template>

<script setup>
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import SEARCHRESULT from "@/components/SearchResult.vue";
import WHATSAPP from "../components/Whatsapp.vue"
import PAGINATION from '../components/Pagination.vue'
import Availability from '../components/Availability.vue'
import Condition from '../components/Condition.vue'
import Category from '../components/Category.vue'
import HEADER from "@/components/Header.vue"; 
import FOOTER from "@/components/Footer.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import { onMounted, onUnmounted, onUpdated, watch, computed, reactive, toRefs, ref} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"

import { useProductStore } from '@/stores/products'
import { useSettingStore } from '@/stores/settings'
import { useInteractiveStore } from '@/stores/interactive'
const interactive_store = useInteractiveStore()
      
const route = useRoute()

const router = useRouter()

const products_store = useProductStore()

const settingStore = useSettingStore()

const products = computed(() => {

  return products_store.products

})

const product_id = parseInt(route.params.item.split('_')[1]) //get just the id and make am int

const product = ref([])

const relatedProducts = ref([]);

let quantity = ref(1)

const activeTab = ref("description");



function AddToCart(product, quantity) {

  products_store.add_to_cart(product, quantity)

}



function getProducts(product_id) { 

 product.value = products.value.filter((product) => { //get individual product

    return product.product_id === product_id;

  })

  
if (product.value.length < 1 ) { //if product nor dey. redirect to page not found

   router.push({name: "home"})
    
}
   
}

getProducts(product_id)
   
 

/* Route Guards */

onBeforeRouteUpdate(to => {

    getProducts(parseInt(to.params.item.split('_')[1]))

});

/* Route Guards */


</script>

<style scoped>

/* GENERAL STYLING */

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
    text-transform: capitalize;
    color: var(--primary-blue);
}

.grid {
    margin-top: 30px;
}

div.image {
      border: 1px solid rgb(77, 77, 77);
      padding: 28px;
      background-color: rgb(43, 42, 42);
      margin: auto;
      border-radius: 15px;
      display: block;
  }

  div.image img{
      display: block;
      width: 100%;
      height: 400px;
      object-fit: contain;
      margin: auto;
  }

  div.info {
      color: var(--primary-white);
      margin: 20px 0 0 0;
  }

  .spans {
      margin: 0px 0 10px 0;
  }

  #title{
      font-size: 23px;
      font-weight: 800;
      text-transform: capitalize;
      color: var(--primary-white);
      margin: 0px 0 10px 0;
  }

  #description{
      line-height: 25px;
      color: #aaa;
      font-size: 15px;
  }

  div.info h3{
      line-height: 25px;
      margin: 11px 0;
      font-size: 26px;
      color: var(--primary-blue);
  }

  .cart-actions {
  display: flex;
  align-items: center;
  margin-top: 30px;
  gap: 12px;
  font-family: "Poppins", "Inter", sans-serif;
}

/* Quantity box */
.quantity-box {
  display: flex;
  align-items: center;
  background-color: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  overflow: hidden;
  height: 44px;
  min-width: 120px;
  justify-content: space-between;
  padding: 0 8px;
}

.qty-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  width: 36px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.qty-btn:hover {
  color: #ff4c4c;
}

.qty-value {
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

/* Add to Cart button */
.add-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--primary-blue);
  color: #fff;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  font-size: 15px;
  height: 44px;
  padding: 0 28px;
  box-sizing: border-box;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-cart-btn:hover {
  background-color: var(--primary-blue);
}

.cart-icon {
  width: 18px;
  height: 18px;
}


.cards {
  gap: 20px;
  display: grid;
  margin-top: 45px;
  grid-template-columns: 1fr 1fr 1fr;
}

.card {
  text-align: center;
  color: var(--primary-white);
}

.card svg {
    width: 22px;
    height: 30px;
}

.card h2 {
  font-size: 13px;
  font-weight: bold;
  margin: 5px 0;
}

.card p {
  font-size: 13px;
  margin: 5px 0;
  color: rgb(141, 139, 139);
}


.auth-container {
  padding: 0px;
}

/* Tabs */
.tab-container {
  display: flex;
  padding: 3px;
  width: 100%;
  background: var(--secondary-black);
  border-radius: 12px;
  margin: 50px 0 20px 0;
  border: 1px solid #333;
}
.tab {
  flex: 1;
  padding: 5px 0;
  background: transparent;
  border: none;
  color: #888;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: var(--primary-black);
  color: #fff;
  border: none;
  border-radius: 12px;
}
.tab_info {
  text-transform: capitalize;
  margin-top: 20px;
  color: rgb(145, 144, 144);
  padding: 20px 20px;
  border: 1px solid var(--secondary-white);
  background-color: rgb(20, 20, 20);
  border-radius: 12px;
}
.tab_info h1{
  margin: 0 0 15px 0px;
  font-size: 20px;
  color: var(--primary-white);
}
.tab_info p{
 font-size: 15px;
 line-height: 25px;
}
.list {
 margin-top: 30px;
 display: flex;
 font-size: 16px;
 justify-content: space-between;
 padding-bottom: 6px;
 border-bottom: 1px solid var(--secondary-white);
}
.list #field {
 color: var(--primary-white);
}


/* DESKTOP */
@media only screen and (min-width: 765px) {

  div.grid {
      display: grid;
      align-items: flex-start;
      column-gap: 40px;
      grid-template-columns: 50% auto;
  }

  div.image {
      border: 1px solid rgb(211, 211, 211);
      padding: 20px;
      margin: 0;
      display: block;
  }

  div.image img{
      display: block;
      width: 100%;
      height: 400px;
      object-fit: cover;
      margin: auto;
  }

  div.info {
      align-self: top;
      margin: 0px 0 0 0;
  }
}
</style>