<template>
  
  <div>

  <CANCELORDERMODAL/>

  <div class = "confirm_reject">

      <button id = "reject" @click = "reject_order(order)">Reject</button> 
     
      <button id = "confirm" @click = "confirm_order(order.order_id, order.user_id)">Confirm</button>
  
  </div>

  </div>

</template>

<script setup>

import API from "../../api";

import CANCELORDERMODAL from "@/components/modals/cancel_order_modal.vue";

import { computed, reactive, toRefs, ref} from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useOrdersStore } from '@/stores/orders'

const orders_store = useOrdersStore()

const interactive_store = useInteractiveStore()

const props = defineProps({

  order: Object

})

const { order } = toRefs(props)

function reject_order(order) {

    interactive_store.toggle_cancel_order_modal(true,
    {
        id: order.order_id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.email,
    })
    
}


async function confirm_order(id, owner_id) {
    
    interactive_store.toggle_loading_overlay(true) //display loading overlay

    const confirmationPayload = { //info to be sent

     description: 'Your order has been confirmed for processing',

     id: id,

     owner_id: owner_id

    }
    
    const response = await API.confirm_order(confirmationPayload); //send confirmation request

    if (response.message === "success") {

       await orders_store.fetch_orders() //update store with fresh orders

       interactive_store.toggle_loading_overlay(false) //remove loading overlay

       interactive_store.backend_message = "Order Confirmed"
        
       interactive_store.display_success_alert_box()
        
    } else {

       interactive_store.toggle_loading_overlay(false) //remove loading overlay

       interactive_store.backend_message = "Error Occured, Please Try Again"
        
       interactive_store.display_error_alert_box()

    }
}

 
</script>

<style scoped>
/*DESKTOP VIEW*/
@media only screen and (min-width: 992px) {
div.confirm_reject {
    float: right;
    margin: 5px 0 0px 0;
}
div.confirm_reject button{
    padding: 5px 20px;
    font-size: 15px;
    font-weight: bold;
    margin: 3px 0 5px 10px;
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


/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
div.confirm_reject {
    float: right;
    margin: 5px 0 20px 0;
}
div.confirm_reject button{
    padding: 5px 20px;
    font-size: 15px;
    font-weight: bold;
    margin: 3px 0 5px 10px;
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