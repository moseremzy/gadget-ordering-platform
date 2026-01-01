<template>
  <router-view />
</template>

<script setup>

import { onMounted, onUnmounted, ref, watch } from 'vue'

import { useSettingStore } from '@/stores/settings'

import { useOrdersStore } from '@/stores/orders'

import { useAdminStore } from '@/stores/admin'

import { useProductStore } from './stores/products';

import { useCustomersStore } from './stores/customers'

import { useCategoriesStore } from './stores/categories';

import { useInteractiveStore } from './stores/interactive';

import API from "./api/index";

const admin_store = useAdminStore(); // Access the admin

const ordersStore = useOrdersStore(); //Access the orders store

const customers_store = useCustomersStore()

const products_store = useProductStore()

const categoriesStore = useCategoriesStore();

const settingStore = useSettingStore();

const interactiveStore = useInteractiveStore();

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

setInterval(async () => {   // In App.vue (your polling function)

  try {

    await admin_store.fetch_admin().catch(err => { // Try to fetch user but DON'T block the app if it fails

        console.log("Admin fetch failed (not logged in).", err); 
      
    });

    if (admin_store.isAuthenticated) {

        await Promise.all([

        ordersStore.fetch_orders(),

        products_store.fetch_products(),

        customers_store.fetch_customers(),

        categoriesStore.fetch_categories(),

        settingStore.fetch_settings()

        ]);
    }       
  
  } catch (error) {
    
    console.error("Polling error:", error);
  
  }

}, 300000); // 5 minutes

})



onUnmounted(() => {

  window.removeEventListener('resize', updateWindowWidth)

})

</script>
