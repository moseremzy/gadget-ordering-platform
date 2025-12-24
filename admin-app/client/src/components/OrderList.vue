<template>
  
  <div>
  <!-- <CANCELORDERMODAL :id  = _id :user_id = user_id /> -->

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

    <p>Payment - {{order.payment_method}}</p>
    <p>Confirmation pin - {{order.confirmation_pin}}</p>
    <hr>

    <div id = "price_buttons">
      
      <h2>Order Price - {{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total_amount)}}</h2>
      
       <!-- confirm/reject order button  -->
       
       <CONFIRMREJECTSTATUS :order = order v-if = "order.order_status == 'pending'" />

       <!-- confirm/reject order button  -->


       <!-- Status Filter -->
    
       <STATUSFILTER :order = order v-else/>

        <!-- Status Filter -->

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

import STATUSFILTER from './status_components/StatusFilter.vue';

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
/* MOBILE VIEW */
@media only screen and (max-width: 700px) {
* {
    margin: 0;
    padding: 0;
    font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
}
div.grid3 {
    border-radius: 7px;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    margin: 0;
}
div.order {
    padding: 13px;
    border: 1px solid rgb(192, 189, 189);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);
    border-radius: 7px;
    margin: 0px 0 20px 0;
    background-color: white;
}
div#id_date {
    display: flex;
    justify-content: space-between;
}
div#id_date p{
    font-size: 1.4rem;
}
div#image_quantity{
    margin: 5px 0 30px 0;
    font-size: 15px;
}
div#image_quantity img{
    display: inline-block;
    margin-right: 10px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 100%;
    float: left;
}
#link {
    font-weight: bold;
}
div.order p{
    clear: both;
    font-size: 1.5rem;
    text-align: right;
    margin: 10px 0;
    font-weight: bold;
}
hr {
    margin: 0;
    border: 1px solid rgb(218, 215, 215);
}
div#price_buttons {
    display: flex;
    justify-content: space-between;
}
div#price_buttons h2{
    font-size: 15px;
    font-weight: bold;
    margin: 9px 5px 7px 0;
}
div#price_buttons button {
    margin: 10px 4px 0 4px;
    padding: 5px 20px;
    font-size: 15px;
    font-weight: bold;
    margin-left: 10px;
    color: white;
}
#reject {
    background-color: rgb(145, 76, 76);
    border: 1px solid rgb(145, 76, 76);
}
#confirm {
    background-color: green;
    border: 1px solid green;
}
}

/* DESKTOP VIEW */
@media only screen and (min-width: 700px) {
* {
    margin: 0;
    padding: 0;
    font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
}
div.grid3 {
    padding: 0;
    border-radius: 7px;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    margin: auto;
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
}
div.order {
    padding: 13px;
    border: 1px solid rgb(192, 189, 189);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);
    border-radius: 7px;
    background-color: white;
}
div#id_date {
    display: flex;
    justify-content: space-between;
}
div#id_date p{
    font-size: 1.5rem;
}
div#image_quantity{
    margin: 5px 0 30px 0;
    font-size: 16px;
}
div#image_quantity img{
    display: inline-block;
    margin-right: 10px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 100%;
    float: left;
}
#link {
    font-weight: bold;
}
div.order p{
    clear: both;
    font-size: 1.7rem;
    text-align: right;
    margin: 10px 0;
    font-weight: bold;
}
hr {
    margin: 0;
    border: 1px solid rgb(218, 215, 215);
}
div#price_buttons {
    display: flex;
    justify-content: space-between;
}
div#price_buttons h2{
    font-size: 15px;
    font-weight: bold;
    margin: 9px 5px 7px 0;
}
div#price_buttons button {
    margin: 10px 4px 0 4px;
    padding: 5px 20px;
    font-size: 15px;
    font-weight: bold;
    margin-left: 10px;
    color: white;
}
#reject {
    background-color: rgb(145, 76, 76);
    border: 1px solid rgb(145, 76, 76);
}
#confirm {
    background-color: green;
    border: 1px solid green;
}
}
</style>
 
