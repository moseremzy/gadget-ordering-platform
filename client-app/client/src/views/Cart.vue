<template>

 <div>

 <HEADER/> 

 <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

 <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

 <TERMSCONDITION
    v-if = "user_store.showTermsConditions" 
    :showTermsCondition = "user_store.showTermsConditions" 
    @close = "user_store.showTermsConditions = false"
  />

 <SEARCHRESULT/>

 <SIDEBAR/>

   <div class = "home_container" v-if = "products_store.cart_products.length > 0">

    <h1>Your Cart</h1>

    <div class="cart-container">
    <!-- LEFT SECTION -->
    <div class="cart-items">
      <div class="cart-item" v-for = "item in products_store.cart_products" :key = "item.product_id">
        <img :src="item.main_image" alt="" />

        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p class="price">₦{{ item.price.toLocaleString() }}</p>
        </div>

        <div class="quantity-controls">
          <div class="quantity-box">
            <button class="qty-btn" @click = "decrement_quantity(item)">−</button>
            <span class="qty-value">{{item.quantity}}</span>
            <button class="qty-btn" @click = "increment_quantity(item)">+</button>
          </div>
          <button class="delete-btn" @click = "products_store.remove_from_cart(item)"><font-awesome-icon class="fa-solid fa-trash icons" icon="fa-solid fa-trash" /></button>
        </div>
      </div>
    </div>

    <!-- RIGHT SECTION -->
    <div class="order-summary">
      <h3>Order Summary</h3>

      <ul>
        <li v-for="item in products_store.cart_products" :key="item.product_id">
          <span>{{ item.name }} x{{ item.quantity }}</span>
          <span>₦{{ (item.price * item.quantity).toLocaleString() }}</span>
        </li>
      </ul>

      <div class="total">
        <span>Total</span>
        <span>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(products_store.cart_subtotal_amount)}}</span>
      </div>

      <router-link to = "/account/checkout" class="checkout-btn">
        <font-awesome-icon class="fa-solid fa-cart-shopping icons" icon="fa-solid fa-cart-shopping" />
        Proceed
      </router-link >

      <p class="note">
        Orders are processed through checkout for personalized service
      </p>
    </div>
  </div>

  </div> <!-- home_container -->

  <div class = "home_container" v-else> <!-- CART EMPTY -->
 
      <h1>Your Cart</h1>

      <EMPTYCART/>

   </div>
 
  <WHATSAPP/>

 <FOOTER/>

 </div>
</template>

<script setup>
import SEARCHRESULT from "@/components/SearchResult.vue";
import TERMSCONDITION from "../components/TermsConditionModal.vue";
import EMPTYCART from "@/components/EmptyCart.vue";
import HEADER from "@/components/Header.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import FOOTER from "@/components/Footer.vue";
import { useProductStore } from '@/stores/products'
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import { useInteractiveStore } from '@/stores/interactive'
import { useSettingStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
const base_url = process.env.VUE_APP_API_BASE_URL

const products_store = useProductStore()
const interactive_store = useInteractiveStore()
const setting_store = useSettingStore()
const user_store = useUserStore()

/* Hooks */

onMounted(() => {

    MIDDLEWARES.allowScroll()
    
})


onUpdated(() => {

    MIDDLEWARES.allowScroll()
    
})


// Function to increment item quantity
function increment_quantity(product) {
  const targetProduct = products_store.cart_products.find(cartProduct => cartProduct.product_id === product.product_id);
  if (targetProduct) {
    targetProduct.quantity++;
    targetProduct.total = targetProduct.price * targetProduct.quantity; // Update total
  }
  products_store.save_cart_to_Lstorage() //store cart items for localstorage
}


// Function to decrement product quantity
function decrement_quantity(product) {
  const targetProduct = products_store.cart_products.find(cartProduct => cartProduct.product_id === product.product_id);
  if (targetProduct) {
    targetProduct.quantity > 1 ? targetProduct.quantity-- : null
    targetProduct.total = targetProduct.price * targetProduct.quantity; // Update total
  }
  products_store.save_cart_to_Lstorage() //store cart items for localstorage
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


.cart-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 30px;
  margin-top: 30px;
  justify-content: space-between;
  padding: 0px;
  background: #0d0d0d;
  color: #fff;
}

/* Left side - Cart Items */
.cart-items {
  flex: 1.2;
  width: 100%;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid rgb(77, 77, 77);
  padding: 15px;
  margin-bottom: 15px;
}

.cart-item img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
}

.item-details {
  text-transform: capitalize;
  flex: 1;
  margin-left: 15px;
}

.item-details h3 {
  line-height: 20px;
  font-size: 15px;
  margin-bottom: 5px;
}

.price {
  font-size: 16px;
  color: var(--primary-blue);
  font-weight: bold;
  margin-bottom: 4px;
}

.stock-note {
  background: var(--primary-blue);
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 13px;
  display: inline-block;
}

.quantity-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #111;
  border-radius: 12px;
  gap: 6px;
  padding: 4px 8px;
}

/* Quantity box */
.quantity-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  overflow: hidden;
  height: 44px;
  min-width: 110px;
  justify-content: space-between;
  padding: 0 8px;
}

.qty-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.qty-btn:hover {
  color: var(--primary-blue);
}

.qty-value {
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.delete-btn {
  background: rgb(235, 76, 76);
  border-radius: 30%;
  border: 1px solid rgb(231, 74, 74);
  padding: 8px 12px;
  margin-left: 8px;
}

/* Right side - Order Summary */
.order-summary {
  align-items: flex-start;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid rgb(77, 77, 77);
  padding: 25px;
  width: 400px;
  height: auto;
}

.order-summary h3 {
  margin: 0 0 20px 0;
}

.order-summary ul {
  list-style: none;
  padding: 0;
  border-bottom: 1px solid #333;
  margin-bottom: 15px;
}

.order-summary li {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin: 8px 0;
}

.total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 20px;
}

.checkout-btn {
  text-decoration: none;
  background: var(--primary-blue);
  border: none;
  display: inline-block;
  text-align: center;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.checkout-btn .icons {
  margin-right: 7px;
}

.note {
  font-size: 12px;
  color: #aaa;
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 900px) {
  .cart-container {
    flex-direction: column;
    padding: 0px;
  }

  .cart-items {
    flex: 1.2;
    min-width: 100px;
}

  .order-summary {
    width: 100%;
}

.order-summary h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
}
 
div.home_container h1{
    font-size: var(--container-mobile-font-size);
}

.quantity-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #111;
  border-radius: 12px;
  gap: 6px;
  margin-left: 3px;
  padding: 4px 8px;
}

/* Quantity box */
.quantity-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  overflow: hidden;
  height: 44px;
  min-width: 85px;
  justify-content: space-between;
  padding: 0 5px;
}

.qty-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease;
}

.qty-btn:hover {
  color: var(--primary-blue);
}

.qty-value {
  color: #fff;
  font-weight: 600;
  font-size: 12px;
}

.delete-btn {
  background: rgb(235, 76, 76);
  border-radius: 30%;
  font-size: 13px;
  border: 1px solid rgb(231, 74, 74);
  padding: 4px 8px;
  margin-left: 8px;
}
 
}

</style>