import { defineStore } from "pinia";

import API from "../api/index";

export const useRecordsStore = defineStore("records", {

    state: () => ({

      records: []

    }),

    getters: {

      total_records: (state) => { //total records regardless status
 
        return state.records.length
      
      }
        
    },
    
    actions: {
    
      async fetch_records() {
    
        const response = await API.fetch_records(); // Your API endpoint

        this.records = response.all_records || []

    }
  }
})