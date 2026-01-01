<template>
  
  <div>

  <div class = "grid3" v-if = "orders.length > 0">
   <template v-for = "order in orders" :key = "order.order_id">
   <div class = "order">            
    <div id = "id_date">
    <p style = "text-align: left;">ORDER ID - <b style = "color:rgb(60, 120, 199);">#{{order.order_id}}</b></p>
    <p>ORDER DATE - <b>{{MIDDLEWARES.formatted_date(order.created_at)}}</b></p>
    </div>
    
    <template v-for = "item in (order_items).filter((order_item) => order_item.order_id === order.order_id).slice(0, 2)" :key = "item.name">
    <div id = "image_quantity">
    <img :src = "'http://localhost:8081/images/'+item.main_image" :alt="item.name"> 
    {{item.product_name}} x {{item.quantity}}
    </div>
    </template>

    <router-link :to = "'/account/view-order/'+order.order_id" id = "link">View..</router-link> 

    <div class = "payment_status">
    <PAYMENTSTATUS :order = order />
    <div>
    <p>Payment - {{order.payment_method}}</p>
    <p>Confirmation pin - {{order.confirmation_pin}}</p>
    </div>
    </div>
    <hr>

    <div class="order-footer">
    <!-- PRICE -->
    <div class="order-price">
        <span>Order Total</span>
        <h2>
        {{ new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(order.total_amount) }}
        </h2>
    </div>

    <!-- STATUS / ACTIONS -->
    <div class="order-status-area">
      
       <CONFIRMREJECTSTATUS v-if="order.order_status === 'pending'" :order="order" /> <!-- Pending: show actions -->

       <div v-else class="order-status-row"> <!-- Otherwise: show statuses -->
        <ORDERSTATUS :order="order" />
        </div>
    </div>

    </div>

  </div>

 </template>

 </div>

<ITEMSNOTFOUND v-else>
   No {{category}} Orders
</ITEMSNOTFOUND>

</div>

</template>



<script setup>

import ITEMSNOTFOUND from "@/components/ItemsNotFound.vue";

import MIDDLEWARES from "../middlewares/middlewares"

import API from "../api";

import CONFIRMREJECTSTATUS from '../components/status_components/ConfirmRejectStatus.vue'

import SUCCESSALERTBOX from "@/components/alert_box/success.vue";

import ERRORALERTBOX from "@/components/alert_box/error.vue";

import ORDERSTATUS from './status_components/OrderStatus.vue';

import PAYMENTSTATUS from './status_components/PaymentStatus.vue';

import { computed, reactive, toRefs, ref} from 'vue'

import { useOrdersStore } from '@/stores/orders'

import { useInteractiveStore } from '@/stores/interactive'

const interactive_store = useInteractiveStore()

const orders_store = useOrdersStore()

const props = defineProps({

  orders: Object,

  order_items: Object,

  category: String,

})

const { orders, order_items, category } = toRefs(props)

</script>

<style scoped>

/* shared base styles */
* {
  margin: 0;
  padding: 0;
  font-family: "Roboto","Helvetica Neue","Helvetica",Arial,sans-serif;
}

hr {
  margin: 0;
  border: 1px solid rgb(218, 215, 215);
}

#link {
  font-weight: bold;
}

.payment_status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 0 0;
}

/* MOBILE VIEW */
@media only screen and (max-width: 700px) {

div.grid3 {
  border-radius: 7px;
  width: 100%;
}

div.order {
  padding: 13px;
  border: 1px solid rgb(192, 189, 189);
  box-shadow: 0 4px 8px rgba(0,0,0,.2), 0 6px 20px rgba(0,0,0,.19);
  border-radius: 7px;
  margin-bottom: 20px;
  background-color: white;
}

div#id_date {
  display: flex;
  justify-content: space-between;
}

div#id_date p {
  font-size: 1.4rem;
}

div#image_quantity {
  margin: 5px 0 30px 0;
  font-size: 15px;
}

div#image_quantity img {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 100%;
  float: left;
}

div.order p {
  clear: both;
  font-size: 1.5rem;
  text-align: right;
  margin: 10px 0;
  font-weight: bold;
}

/* footer layout */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center; /* ❗ was flex-end */
  margin-top: 12px;
}


.order-price h2 {
  font-size: 15px;
  font-weight: bold;
}

.order-status-area {
  display: flex;
  align-items: center;
}

.order-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
}


}

/* DESKTOP VIEW */
@media only screen and (min-width: 700px) {

div.grid3 {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
}

div.order {
  padding: 13px;
  border: 1px solid rgb(192, 189, 189);
  box-shadow: 0 4px 8px rgba(0,0,0,.2), 0 6px 20px rgba(0,0,0,.19);
  border-radius: 7px;
  background-color: white;
}

div#id_date {
  display: flex;
  justify-content: space-between;
}

div#id_date p {
  font-size: 1.5rem;
}

div#image_quantity {
  margin: 5px 0 30px 0;
  font-size: 16px;
}

div#image_quantity img {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 100%;
  float: left;
}

div.order p {
  clear: both;
  font-size: 1.7rem;
  text-align: right;
  margin: 10px 0;
  font-weight: bold;
}

/* footer layout */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center; /* ❗ was flex-end */
  margin-top: 12px;
}


.order-price span {
  font-size: 12px;
  color: #777;
  display: block;
}

.order-price h2 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 4px;
}

.order-status-area {
  display: flex;
  align-items: center;
}

.order-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
}


}

/* buttons (unchanged) */
#reject {
  background-color: rgb(145, 76, 76);
  border: 1px solid rgb(145, 76, 76);
}

#confirm {
  background-color: green;
  border: 1px solid green;
}

</style>
 
