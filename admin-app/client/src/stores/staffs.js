import { defineStore } from "pinia";

import API from "../api/index";

export const useStaffsStore = defineStore("staffs", {

    state: () => ({

        all_staffs: []

    }),

    getters: {

      staffs: (state) => { //all staffs

         return state.all_staffs
         
      },

      total_staffs: (state) => { //all staffs

      return state.staffs.length
        
      }
        
     },
    
    actions: {

      async fetch_staffs() {

        const response = await API.fetch_staffs(); // Your API endpoint

        this.all_staffs = response.all_staffs

      }
   }
})