<template>

<div class="container" :style = "interactive_store.container_css">

<OVERLAY/>

<SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

<ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

<SIDEBAR/> <!--side bar--> 

<div class="sub_container" :style = "interactive_store.sub_container_css">

<HEADER page_name = "add-item" searchbox_placeholder = "Enter Item Name To Search" /> <!-- Header -->

<h1>Create Order</h1>

<div class="add-item-form-container">
<h2 class="form-title"><slot name="form-title"></slot></h2>
<form class="add-item-form grid-form">

<!-- Customer Name -->
<div class="form-group">
<label class="form-label">Customer Name</label>
<input
v-model="order.customer_name"
class="form-input"
placeholder="Walk-in customer"
/>
<p class="err">{{order_error.customer_name_err}}</p>
</div>

<!-- Customer Phone -->
<div class="form-group">
<label class="form-label">Customer Phone</label>
<input
v-model="order.customer_phone"
class="form-input"
placeholder="Phone Number"
/>
<p class="err">{{order_error.customer_phone_err}}</p>
</div>

<!-- Customer Name -->
<div class="form-group grid-full">
<label class="form-label">Customer Address</label>
<input
v-model="order.customer_address"
class="form-input"
placeholder="Optional"
/>
</div>

<!-- Payment Method -->
<div class="form-group grid-full">
<label class="form-label">Payment Method</label>
<select v-model="order.payment_method" class="form-input">
<option value="">Select Method</option>
<option value="cash">Cash</option>
<option value="transfer">Transfer</option>
<option value="pos">POS</option>
</select>
<p class="err">{{order_error.payment_method_err}}</p>
</div>


<!-- Product selector -->
<div class="form-group grid-full">
<label id = "item-name" class="form-label">Item Name</label>
<input
  id="item-name"
  type="text"
  v-model="custom_item.name"
  class="form-input"
  placeholder="Enter custom item name"
/>
</div>

<div class="form-group grid-full">
<label for="item-price" class="form-label">Item Price ({{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(custom_item.price)}})</label>
<input
  id="item-price"
  type="number"
  v-model="custom_item.price"
  class="form-input"
  placeholder="Enter price"
/>

<button type="button" class="submit-button" @click="addItem">Add Item</button>
</div>


<!-- Added Products List -->
<div class="items-list grid-full">

  <div
    v-for="(item, index) in order.items"
    :key="index"
    class="item-card"
  >

    <!-- Left -->
    <div class="item-info">
      <h4>{{ item.name }}</h4>
      <p class="price">{{ currency(item.price) }}</p>
    </div>

    <!-- Middle -->
    <div class="item-qty">
      <label>Qty</label>
      <input
        type="number"
        min="1"
        v-model="item.quantity"
      />
    </div>

    <!-- Right -->
    <div class="item-actions">
      <button
        type="button"
        class="remove-btn"
        @click="removeItem(index)"
      >
        ✕
      </button>
    </div>

  </div>

</div>


<!-- Order Total -->

<div class="form-group grid-full">
    <h4>Total: {{ currency(total) }}</h4>
</div>


<div class="form-group grid-full">
    <button @click.prevent="createOrder" class="submit-button">Create Order</button>
</div>

</form>
  </div>
  </div> <!-- SUB_CONTAINER -->
</div> <!-- CONTAINER --> 
</template>

<script setup>

import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch, computed} from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useProductStore } from '@/stores/products'

import { useCategoriesStore } from '@/stores/categories'

import { useOrdersStore } from '@/stores/orders'

import { useRoute, useRouter } from 'vue-router'

import HEADER from '../components/Header.vue'; 

import OVERLAY from '../components/modals/loading_overlay.vue';

import SIDEBAR from '../components/SideBar.vue';

import MIDDLEWARES from "@/middlewares/middlewares.js"

import API from "../api/index";

const interactive_store = useInteractiveStore()

const products_store = useProductStore();

const categories_store = useCategoriesStore()

const orders_store = useOrdersStore()

const route = useRoute()
const router = useRouter()

const order = reactive({

    customer_name: "",

    customer_phone: "",

    customer_address: "",

    payment_method: "",

    items: []

})

let order_error = reactive({
    customer_name_err: "",
    customer_phone_err: "",
    payment_method_err: "",
})

const custom_item = reactive({
    name: "",
    price: ""
})

const products = computed(() => products_store.products)


onUpdated(() => {
    customer_name_validated()
    customer_phone_validated()
    payment_method_validated()
})


function customer_name_validated() {
    if (order.customer_name === "") {
        order_error.customer_name_err = "Please fill the field";
    } else {
        order_error.customer_name_err = "";
        return true;        
    }
}


function customer_phone_validated() {
    if (order.customer_phone === "") {
        order_error.customer_phone_err = "Please fill the field";
    } else {
        order_error.customer_phone_err = "";
        return true;        
    }
}

function payment_method_validated() {
    if (order.payment_method === "") {
        order_error.payment_method_err = "Please fill the field";
    } else {
        order_error.payment_method_err = "";
        return true;        
    }
}


function addItem() {

  if (custom_item.name && custom_item.price) {

    order.items.push({
      product_id: null,
      item_name: custom_item.name,
      name: custom_item.name,
      price: Number(custom_item.price),
      quantity: 1
    })

    custom_item.name = ""
    custom_item.price = ""
    return
  }

  // ERROR
  interactive_store.backend_message = "Select a product or enter item manually"
  
  interactive_store.display_error_alert_box()

}


function removeItem(index) {

    order.items.splice(index, 1)

}


const total = computed(() => {

return order.items.reduce( (sum, item) => { 
    
   return sum + item.price * item.quantity
    
 },0)

})


async function createOrder() {

if (!order.items.length) {

    interactive_store.backend_message = "Add at least one product"

    interactive_store.display_error_alert_box()

    return

}

if (!customer_name_validated() || !customer_phone_validated() || !payment_method_validated()) {

    interactive_store.backend_message = "Customer Info Required"

    interactive_store.display_error_alert_box()

    return
    
}

  interactive_store.toggle_loading_overlay(true)

  try {

    const response = await API.create_manual_order({

    customer_name: order.customer_name,

    phone: order.customer_phone,

    customer_address: order.customer_address,

    payment_method: order.payment_method,

    total_amount: total.value,

    total_items: order.items.length,

    delivery_fee: 0,

    products: order.items.map(item => ({
        product_id: item.product_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price
    }))

  })
  
  await orders_store.fetch_orders()

  interactive_store.backend_message = "Order created successfully"

  interactive_store.display_success_alert_box()

  resetForm()

  router.push({name: 'viewOrder', params: {order_id: response.data.order_id}})

  }

  catch(error){

    console.log(error)

 }

    interactive_store.toggle_loading_overlay(false)

}

function resetForm(){
    order.customer_name=""
    order.customer_phone=""
    order.payment_method=""
    order.items=[]
    custom_item.name=""
    custom_item.price=""
}

function currency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(amount || 0)
}

</script>

<style scoped>

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  align-items: center;
  gap: 15px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.item-info h4 {
  margin: 0;
  font-size: 15px;
  color: #111827;
}

.price {
  margin: 2px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.item-qty {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-qty label {
  font-size: 12px;
  color: #6b7280;
}

.item-qty input {
  width: 70px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
}

.remove-btn {
  background: #fee2e2;
  border: none;
  color: #dc2626;
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #fecaca;
}

/*DESKTOP VIEW*/
@media only screen and (min-width: 992px) {
    body {
        margin: 0;
        padding: 0;
        font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
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
        margin:0 0 0 250px;
        height: 100vh;
        padding: 0 15px 50px 15px;
        width: 100%;
        overflow-y: auto;
        width: calc(100% - 250px);
    }
    div.sub_container h1{
        margin: 0px auto 5px auto;
        color: #0E2E45;
        font-size: 35px;
        font-weight: 300;
    }
}
/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
body {
    margin: 0;
    padding: 0;
    font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
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
    margin:0;
    padding: 0 15px 50px 15px;
    width: 100%; /*calc(100% - 250px)*/;
}
div.sub_container h1{
    margin: 0px auto 5px auto;
    color: #0E2E45;
    font-size: 3rem;
    font-weight: 300;
}
}

.add-item-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(145, 138, 138, 0.1);
}

.form-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* Make certain fields span full width */
.grid-full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 16px;
  font-weight: bold;
  color: #555;
}

.form-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

textarea.form-input {
  resize: none;
}

.submit-button {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

p.err {
  color: red;
  font-size: 14px;
  margin: 0;
}

/* Mobile fallback */
@media (max-width: 768px) {
  .grid-form {
    grid-template-columns: 1fr;
  }

  .grid-full {
    grid-column: span 1;
  }
}

</style>
