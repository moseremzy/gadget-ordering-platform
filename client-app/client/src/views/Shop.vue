<template>
  <div>
    <HEADER/> 
    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
    <SEARCHRESULT/>
    <SIDEBAR/>

    <div class="home_container">
     <h1>Shop {{route.query.category || 'All'}} Products</h1>
     <p>Discover authentic gadgets with warranty and fast delivery</p>

     <div class = "products_section">
       <p>Showing {{paginatedProducts.length}} of {{filteredProducts.length}} products</p>
       <div class = "products_grid">
         <Product
          v-for="item in paginatedProducts"
          :key="item.id"
          :product="item"
          @add-to-cart="handleAddToCart"
        />
       </div>

      <PAGINATION 
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          @update:currentPage="currentPage = $event" 
          v-if = "paginatedProducts.length > 0"
      />

     </div>
    </div>
 
    <WHATSAPP/>

    <FOOTER/>
  </div>
</template>

<script setup>
import HEADER from "@/components/Header.vue";
import SEARCHRESULT from "@/components/SearchResult.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import FOOTER from "@/components/Footer.vue";
import Product from "@/components/Product.vue";
import PAGINATION from "@/components/Pagination.vue";
import ITEMSNOTFOUND from "@/components/ItemsNotFound.vue";
import { onMounted, onUnmounted, onUpdated, computed, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useInteractiveStore } from '@/stores/interactive'
import { useProductStore } from '@/stores/products'
import hero_gadgets from "../assets/static_images/hero-gadgets.png"

const route = useRoute()
const router = useRouter()

const interactive_store = useInteractiveStore()

const products_store = useProductStore()

const products = computed(() => {

 return products_store.products

})

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 2;


/* Hooks */

onUpdated(() => {

    scrollTo()

})


/* methods */

let filteredProducts = computed(() => { 

    return route.query.category ? products.value.filter((product) => {

    return product.category_name === route.query.category;

    }) : products.value

})



// Paginated Orders
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});


// Total Pages
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));


function scrollTo() {
  const scroll_to_section = document.querySelectorAll(".home_container");
  if (scroll_to_section.length > 0) {
    scroll_to_section[0].scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

</script>

<style scoped>
/* GENERAL STYLES */
* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

div.home_container {
    margin: 0px;
    padding: 20px;
    background-color: var(--primary-black);
}

div.home_container h1{
    margin: 5px 0;
    color: var(--primary-blue);
}

div.home_container p{
    margin: 5px 0;
    font-size: 16px;
    color: rgb(153, 152, 152);
}

div.products_section {
    margin-top: 30px;
}

div.products_section p{
    margin: 10px 0;
}

.products_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 26px;
}


/* MOBILE */
@media only screen and (max-width: 800px) {

  div.home_container h1{
    font-size: var(--container-mobile-font-size);
  }

}
</style>