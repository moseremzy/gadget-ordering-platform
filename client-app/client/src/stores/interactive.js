import { defineStore } from "pinia";

import API from "@/api";

export const useInteractiveStore = defineStore("interactive", {
    
    state: () => ({

       backend_message: '',

       display_main_nav: false, //state of main nav

       display_success_alert: false, //for item added to cart

       display_error_alert: false, //for error adding item to cart

       display_info_modal: false,

       display_error_modal: false,

       display_success_modal: false,

       display_cancel_order_modal: false,

       display_terms_conditions_modal: false,

       display_loading_overlay: false,

       query: '', //query for search box

       page_to_go: '',

    }),

    // getters: {
    //     doubleCount: (state) => state.count * 2,
    //  },
    
    actions: {

        setQuery(query) { //for search box

           this.query = query

        },

        clearQuery() { //for search box

            this.query = ''
 
         },

        toggle_main_nav(state) { //toggle main nav

            this.display_main_nav = state

        },

        toggle_myorders_nav(state) { //toggle main nav

            this.display_myorders_nav = state

        },

        toggle_vieworders_nav(state) { //toggle main nav

            this.display_vieworders_nav = state

        },

        toggle_info_modal(state) { //toggle main nav

            this.display_info_modal = state

        },

        display_error_modal_box(action) { //display error box if i add item succesfully
  
            this.display_error_modal = action

        },

        display_success_modal_box(action) { //display error box if i add item succesfully
  
            this.display_success_modal = action

        },

        toggle_cancel_order_modal(state) { //toggle main nav

            this.display_cancel_order_modal = state

        },

        toggle_soup_selection_modal(state) { //toggle main nav

            this.display_soup_selection_modal = state

        },

        display_terms_conditons_box(action) { //display error box if i add item succesfully
  
            this.display_terms_conditions_modal = action

        },

        toggle_changeaddress_modal(state) { //toggle main nav

            this.display_changeaddress_modal = state

        },

        display_success_alert_box() { //display success box if i add item succesfully

            this.display_success_alert = true

            setTimeout(() => {

            this.display_success_alert = false

            }, 2000)

        },

        display_error_alert_box() { //display error box if i add item succesfully

            this.display_error_alert = true

            setTimeout(() => {

            this.display_error_alert = false

            }, 3000)

        },

        set_page_to_go(page) {
        
            this.page_to_go = page
 
       },

       toggle_loading_overlay(state) { //toggle main nav

            this.display_loading_overlay = state

      },

    }
})