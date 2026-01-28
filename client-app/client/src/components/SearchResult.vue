<template>
  <div v-if="interactive_store.query">
    <!-- Backdrop -->
    <div class="modal-backdrop"></div>

    <!-- Search Container -->
    <div class="search_container">
      <div class="search">
        <SEARCHBOX />
      </div>

      <h1>
        Search –
        <span>{{ interactive_store.query }}</span>
      </h1>

      <!-- No result -->
      <div class="result" v-if="filteredProducts.length === 0">
        <div class="not-found">
          <h2>Gadget Not Found</h2>
          <p>
            Can’t find what you’re looking for?
            You can place a request order and our support team will assist you.
          </p>

          <a
            :href="`https://wa.me/${settings_store.whatsapp}`"
            target="_blank"
            class="whatsapp-link"
          >
            <i class="fab fa-whatsapp"></i>
            Chat with Customer Support
          </a>
        </div>
      </div>

      <!-- Results -->
      <div class="result" v-else>
        <router-link
          v-for="product in filteredProducts"
          :key="product.product_id"
          :to="`/view-product/${product.name}_${product.product_id}`"
          class="link"
          @click="interactive_store.clearQuery"
        >
          <div class="product">
            <img :src="product.main_image" :alt="product.name" />

            <div class="info">
              <h2>{{ product.name }}</h2>
              <p>{{ product.description.slice(0, 60) }}...</p>
              <p class="price">
                {{
                  new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN'
                  }).format(product.price)
                }}
              </p>
            </div>
          </div>
          <hr />
        </router-link>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/products'
import { useInteractiveStore } from '@/stores/interactive'
import SEARCHBOX from '@/components/SearchBox.vue'
 import { useSettingStore } from '../stores/settings'

const settings_store = useSettingStore()
const products_store = useProductStore()
const interactive_store = useInteractiveStore()

const filteredProducts = computed(() => {
  const query = interactive_store.query.toLowerCase()

  return products_store.products.filter(product =>
    product.name.toLowerCase().includes(query)
  )
})
</script>


<style scoped>
/* BACKDROP */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #000;
  opacity: 0.5;
  z-index: 5;
}

/* CONTAINER */
.search_container {
  position: fixed;
  inset: 0;
  z-index: 6;
  background: var(--secondary-black);
  color: #f1f1f1;
  overflow: hidden;
}

/* SEARCH BAR */
.search {
  position: fixed;
  top: 0;
  width: 100%;
  background: var(--secondary-black);
  padding: 10px;
  z-index: 7;
}

/* TITLE */
.search_container h1 {
  margin: 90px 15px 10px;
  font-size: 16px;
  font-weight: 600;
}

.search_container h1 span {
  font-weight: 400;
  font-size: 14px;
  color: #cfcfcf;
}

/* RESULTS */
.result {
  margin-top: 120px;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

/* PRODUCT */
.link {
  text-decoration: none;
}

.product {
  display: flex;
  gap: 12px;
  padding: 15px;
}

.product img {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.product h2 {
  font-size: 15px;
  color: #ffffff;
  margin: 0 0 4px;
}

.product .desc {
  font-size: 14px;
  color: #cfcfcf;
  margin-bottom: 4px;
}

.product .price {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

hr {
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* NOT FOUND */
.not-found {
  text-align: center;
  padding: 40px 20px;
}

.not-found h2 {
  font-size: 17px;
  margin-bottom: 10px;
  color: #ffffff;
}

.not-found p {
  font-size: 14px;
  color: #cfcfcf;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* WHATSAPP */
.whatsapp-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25d366;
  color: #fff;
  padding: 12px 18px;
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none !important;
  font-weight: 500;
}
</style>