import { defineStore } from "pinia";

import API from "../api/index";

export const useOrdersStore = defineStore("orders", {

    state: () => ({
    
      order_items: [],

      orders: [],

      current_order_id: null

    }),

    getters: {

      current_order: (state) => {

        return state.orders.filter((order) => {

          return order.order_id === state.current_order_id

        })
      
      },

      revenue: (state) => { //total revenue for dis year. only orders with status delivered.

        let revenue_total = 0

        state.orders.forEach(order => {

            if (order.order_status == 'delivered' && order.payment_status == 'paid') {
            
              revenue_total += order.total_amount
              
            }
            
        })

        return revenue_total;
      
      },

      total_orders: (state) => { //total orders regardless status
 
        return state.orders.length
      
      }
        
    },
    
    actions: {
    
      async fetch_orders() {
    
        const response = await API.fetch_orders(); // Your API endpoint

        this.order_items = response.all_order_items || []

        this.orders = response.all_orders || []

    }
  }
})