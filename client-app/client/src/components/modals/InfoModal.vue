<template>
  <div class="container">
  <!-- Modal -->
  <div class="modal fade in" id="myModal" role="dialog" style="display: block; top: 30%;" v-if = "interactive_store.display_info_modal">
    <div class="modal-dialog">
      <!-- Modal content-->
      <div class="modal-content">

        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" @click = "interactive_store.toggle_info_modal(false)">&times;</button>
          <h4 class="modal-title">Kelvins Spice</h4>
        </div>
        <div class="modal-body">
          <p><slot></slot></p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal"  @click = "interactive_store.toggle_info_modal(false)">Close</button>
        </div>
      </div>
      
    </div>
  </div>
  <div class="modal-backdrop fade in" v-if = "interactive_store.display_info_modal" @click = "interactive_store.toggle_info_modal(false)"></div>
</div>
</template>

<script setup>

import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import API from "../../api";

const interactive_store = useInteractiveStore()

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
  background-color: rgb(67, 148, 67); /* Primary color */
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

.modal-footer {
  padding: 15px;
  background-color: #f1f1f1;
  border-top: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  text-align: center;
}

.modal-footer .btn {
  background-color: rgb(67, 148, 67); /* Primary color */
  color: #fff;
  border-radius: 20px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.modal-footer .btn:hover {
  background-color: rgb(67, 148, 67); /* Darker primary color */
  transform: scale(1.05);
}

/* Backdrop Styling */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
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