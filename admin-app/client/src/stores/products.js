import { defineStore } from "pinia";

import API from "../api/index";

import { useInteractiveStore } from './interactive'; // Import the cart store

export const useProductStore = defineStore("products", {

    state: () => ({
    
        all_products: []

    }),

    getters: {

        products: (state) => state.all_products,  //products

        total_products: (state) => state.products.length

     },
    
    actions: {
    
      async fetch_products() {

      const response = await API.fetch_products(); // Your API endpoint

      this.all_products = response.all_products

      }
   }
})