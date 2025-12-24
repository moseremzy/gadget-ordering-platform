import { defineStore } from "pinia";

import API from "../api/index";

export const useCustomersStore = defineStore("customers", {

    state: () => ({

        all_customers: []

    }),

    getters: {

      customers: (state) => { //all customers

         return state.all_customers
         
      },

      total_customers: (state) => { //all customers

      return state.customers.length
        
      }
        
     },
    
    actions: {

      async fetch_customers() {

        const response = await API.fetch_customers(); // Your API endpoint

        this.all_customers = response.all_customers

      }
   }
})