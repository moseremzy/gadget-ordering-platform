<template>
  <router-view />
</template>

<script setup>

import { onMounted, onUnmounted, ref, watch } from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useOrdersStore } from '@/stores/orders'

import { useCustomersStore } from '@/stores/customers'

import { useAdminStore } from '@/stores/admin'

const interactiveStore = useInteractiveStore()

const admin_store = useAdminStore()

const orders_store = useOrdersStore()

const customers_store = useCustomersStore()

const windowWidth = ref(window.innerWidth)

// Method to handle responsive sidebar logic
const responsiveSideBar = (width) => {
  if (width >= 992) { // for desktops
    interactiveStore.side_bar_css = { "display": "block" }
    interactiveStore.sub_container_css = { "width": "calc(100% - 250px)" }
    interactiveStore.container_css = {
      "width": "100%",
      "height": "auto",
      "overflow-x": "auto",
      "overflow-y": "hidden"
    }
    interactiveStore.open_hamburger_css = { "display": "none" }
    interactiveStore.close_hamburger_css = { "display": "none" }
  } else {
    interactiveStore.Close_Sidebar()
  }
}

// Watch for changes in window width
watch(windowWidth, (newWidth) => {

  responsiveSideBar(newWidth)

})

// Update the windowWidth ref on resize
const updateWindowWidth = () => {

  windowWidth.value = window.innerWidth

}

 
onMounted(() => {

  window.addEventListener('resize', updateWindowWidth)

  setInterval(async () => { //polling for orders

        await orders_store.fetch_orders()
      
  }, 120 * 1000); //2 minutes


  setInterval(async () => { //polling for admin mainly for session

        await admin_store.fetch_admin()
      
  }, 120 * 1000); //2 minutes


  setInterval(async () => { //polling for customers

        await customers_store.fetch_customers()
      
  }, 120 * 1000); //2 minutes

})



onUnmounted(() => {

  window.removeEventListener('resize', updateWindowWidth)

})

</script>
