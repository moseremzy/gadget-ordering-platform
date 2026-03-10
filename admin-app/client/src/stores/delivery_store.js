import { defineStore } from 'pinia'
import API from '../api/index'

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    loading: false,
    previous_status: null,
    order: null,
    order_items: [],
    gadgets: []
  }),

  getters: {
    isValid: (state) => {
      if (!state.gadgets.length) return false

      const filled = state.gadgets.every(d =>
        d.imei.trim() !== '' &&
        d.source.trim() !== ''
      )

      if (!filled) return false

      const imeis = state.gadgets.map(d => d.imei.trim())
      return new Set(imeis).size === imeis.length
    }
  },

  actions: {

    prepareDeliveryForm(order, items) {
      this.order = order
      this.order_items = items
      this.gadgets = []

    
      items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          this.gadgets.push({
            order_item_id: item.order_item_id,
            product_name: item.product_name,
            imei: '',
            source: ''
          })
        }
      })
    },

    reset() {
      this.order_items = null
      this.gadgets = []
      this.loading = false
    }
  }
})