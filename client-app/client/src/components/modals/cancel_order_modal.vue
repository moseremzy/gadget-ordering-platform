<template>

  <div class="container">
  <!-- Modal -->
  <div class="modal fade in" id="myModal" role="dialog" style="display: block; top: 20%;" v-if = "interactive_store.display_cancel_order_modal">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" @click = "interactive_store.toggle_cancel_order_modal(false)">&times;</button>
          <h4 class="modal-title">Cancel Order</h4>
        </div>
        <div class="modal-body">
          <p>Why do you want to cancel this order?</p>
          <textarea  v-model = "cancellation_reason" maxlength="300" placeholder="Reason for cancellation"></textarea>
          <p class="err" style="color: gray;" ref = "description_counter">{{cancellation_reason.length}}/300 characters</p>
          <p class="err">{{cancellation_reason_err}}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" :disabled = "disablebtn" data-dismiss="modal" @click.prevent = "submit_cancellation"><font-awesome-icon v-if = "spinner"  class="fa-solid fa-spinner fa-spin" id = "spinner" icon="fa-solid fa-spinner"/> Submit</button>
        </div>
      </div>
      
    </div>
  </div>
  <div class = "modal-backdrop" v-if = "interactive_store.display_cancel_order_modal" @click = "interactive_store.toggle_cancel_order_modal(false)"></div> 
</div>
</template>

<script setup>

import { onMounted, onUnmounted, toRefs, onUpdated, reactive, toRaw, ref, watch} from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useUserStore } from '@/stores/user'

import ERRORALERTBOX from "@/components/alert_box/error.vue";

import SUCCESSALERTBOX from "@/components/alert_box/success.vue";

import { useOrdersStore } from '@/stores/orders'

const orders_store = useOrdersStore()

import API from "../../api";

const interactive_store = useInteractiveStore()

const user_store = useUserStore()

const props = defineProps({

  id: String

})

const { id } = toRefs(props)

let cancellation_reason = ref("")
let cancellation_reason_err = ref("")
let spinner = ref(false)
let disablebtn = ref(false)
let description_counter = ref(null)



onUpdated(() => {

   cancellation_validated()

})

 
function cancellation_validated() {

    if (cancellation_reason.value.length >= 300) {

       cancellation_reason.value = cancellation_reason.value.slice(0, 300)
        
       description_counter.value.attributes[2].nodeValue = "color: red;"
    
    } else if (cancellation_reason.value.length < 1) {
 
       cancellation_reason_err.value = "field cannot be empty"
        
    } else {
       
       cancellation_reason_err.value = ""

       description_counter.value ? description_counter.value.attributes[2].nodeValue = "color: gray;" : null
    
       return true
    
    }
}


async function submit_cancellation(e) {

    if (cancellation_validated()) {

            const cancellationPayload = { //info to be sent

            description: cancellation_reason.value,

            id: id.value,

            user: user_store.user

        }

        disablebtn.value = true
        
        e.target.innerText = "Cancelling Order...";

        const response = await API.cancel_order(cancellationPayload); //send cancellation request

        if (response.message === "success") {
        
        interactive_store.backend_message = "Order Cancelled Successfully"

        interactive_store.toggle_cancel_order_modal(false) //hide the cancel modal

        interactive_store.display_success_alert_box() //display success box
       
        e.target.innerText = "Submit" //return button text back
        
        disablebtn.value = false 

        await orders_store.fetch_orders()
       
       } else {

        interactive_store.backend_message = "Error occured, please try again"
        
        interactive_store.toggle_cancel_order_modal(false) //hide the cancel modal

        interactive_store.display_error_alert_box() //display success box
        
        e.target.innerText = "Submit"
        
        disablebtn.value = false

        }

        cancellation_reason.value = ""
        
    }  

}



</script>

<style scoped>
/* General Modal Styling */
.modal-content {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-header {
  background-color: rgb(150, 10, 10); /* Primary color */
  color: #fff;
  padding: 15px 20px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.modal-header .close {
  color: #fff;
  font-size: 1.2rem;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.modal-header .close:hover {
  opacity: 1;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.modal-body {
  padding: 20px;
  font-size: 1.4rem;
  color: #333;
  text-align: center;
}

.modal-body p {
  margin: 0;
  line-height: 1.6;
}

.modal-body textarea {
  width: 100%;
  height: 100px;
  resize: none;
  outline: 0;
  padding: 10px;
}

.modal-footer {
  padding: 15px;
  background-color: #f1f1f1;
  border-top: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  text-align: center;
}

.modal-footer .btn {
  background-color: red; /* Primary color */
  color: #fff;
  border-radius: 20px;
  padding: 8px 20px;
  transition: all 0.3s ease;
  outline: 0;
}

.modal-footer .btn:hover {
  background-color: red; /* Darker primary color */
  transform: scale(1.05);
}

.modal-footer .btn:disabled {
        opacity: .5;
        cursor: none;
    }

/* Backdrop Styling */
.modal-backdrop {
       background-color: rgba(0, 0, 0, 0.5);
}

p.err {
       color: red;
       font-size: 11px;
       margin: 0;
}

/* Fade Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>