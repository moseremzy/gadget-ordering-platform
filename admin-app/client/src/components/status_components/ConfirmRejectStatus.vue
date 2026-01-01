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

import API from "../../api/index";

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
        order_id: order.order_id,
        user_id: order.user_id
    })
    
}


async function confirm_order(order_id, user_id) {
    
    interactive_store.toggle_loading_overlay(true) //display loading overlay

    const confirmationPayload = { //info to be sent

     description: 'Your order has been confirmed for processing',

     order_id: order_id,

     user_id: user_id

    }

    try {
    
    const response = await API.confirm_order(confirmationPayload); //send confirmation request

       await orders_store.fetch_orders() //update store with fresh orders

       interactive_store.backend_message = "Order Confirmed"
        
       interactive_store.display_success_alert_box()
        
    } catch (error) {

       console.log(error)
        
    }

    interactive_store.toggle_loading_overlay(false) //remove loading overlay 

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