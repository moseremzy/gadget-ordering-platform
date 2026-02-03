<template>
  <div>
    <HEADER/> 
    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
    <TERMSCONDITION
      v-if = "interactive_store.display_terms_conditions_modal" 
      :showTermsCondition = "interactive_store.display_terms_conditions_modal" 
      @close = "interactive_store.display_terms_conditions_modal = false"
    />
    <LoadingOverlay/>
    <SEARCHRESULT/>
    <SIDEBAR/>

    <div class="home_container">

    <!--  SECTION 1 -->
    <section class = "section1">
      <div class = "section1_overlay"></div>
      <div class = "info">
        <h2>Bringing the future to your hands</h2>
        <h1>Get Authentic Gadgets</h1>
        <p>We sell, buy and swap phones, computers, accessories & consoles with warranty</p>
        <router-link to = "/shop" id = "browse_product">Browse Products</router-link>
      </div>
      <img src = "../assets/static_images/hero-gadgets.png" alt="">
    </section>


    <!--  SECTION 2 -->
    <section class = "section2">
      <div class = "cards">
        <div class="card">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield mx-auto mb-3 text-primary"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
          <h2>Authentic Products</h2>
          <p>100% genuine gadgets</p>
        </div>
        <div class="card">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck mx-auto mb-3 text-primary"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path><path d="M15 18H9"></path><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path><circle cx="17" cy="18" r="2"></circle><circle cx="7" cy="18" r="2"></circle></svg>
          <h2>Nationwide Delivery</h2>
          <p>Fast & shipping</p>
        </div>
        <div class="card">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award mx-auto mb-3 text-primary"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
          <h2>Warranty Available</h2>
          <p>Protection for your purchase</p>
        </div>
        <div class="card">
          <svg style="color: green;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle mx-auto mb-3 text-whatsapp"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
          <h2>Fast Support Response</h2>
          <p>Quick customer support</p>
        </div>
      </div>

      <div class = "featured_products">
        <h1>Featured Products</h1>
        <p>Discover our best-selling gadgets with warranty and fast delivery</p>
        <div class = "categories">
        <b
         v-for = "category in categories"
         :key="category.id"
         class = "router_link"
         :id = "category.name"
         @click.prevent = "overall_func(category.name)"
         style>
         {{category.name}}
        </b>
        </div>
        <div class = "products-grid">
        <Product
          v-for="item in filteredProducts"
          :key="item.id"
          :product="item"
          @add-to-cart="handleAddToCart"
        />
        </div>
      </div>

      <router-link to = "/shop" class = "view_products">
        View All Products 
        <font-awesome-icon
          style="margin-left: 5px;"
          class="fa-solid fa-arrow-right-long"
          icon="fa-solid fa-arrow-right-long"
        /> 
      </router-link>
    </section>


    </div>
 
    <WHATSAPP/>

    <FOOTER/>
  </div>
</template>

<script setup>
import HEADER from "@/components/Header.vue";
import SEARCHRESULT from "@/components/SearchResult.vue";
import TERMSCONDITION from "../components/TermsConditionModal.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import FOOTER from "@/components/Footer.vue";
import Product from "@/components/Product.vue";
import LoadingOverlay from "../components/modals/loading_overlay.vue";
import ITEMSNOTFOUND from "@/components/ItemsNotFound.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, computed, ref, watch} from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import MIDDLEWARES from "../middlewares/middlewares"
import { useInteractiveStore } from '@/stores/interactive'
import { useProductStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import hero_gadgets from "../assets/static_images/hero-gadgets.png"

const route = useRoute()
const router = useRouter()

const interactive_store = useInteractiveStore()

const products_store = useProductStore()

const categories_store = useCategoriesStore()

const products = computed(() => {

  return products_store.products

})

const categories = computed(() => {

  return categories_store.categories

})


let tab_clicked = ref("");

/* Hooks */

onMounted(() => {

   overall_func(categories.value[0].name) //if category dey link use am, otherwise make all be default
    
})


/* Route Guards */

onBeforeRouteUpdate(to => {

  overall_func(categories.value[0].name) //if category dey link use am, otherwise make all be default

});


/* methods */

let filteredProducts = computed(() => { //search for item

    return products.value.filter((product) => {

    return (product.category_name === tab_clicked.value);

  }).slice(0, 11) //return only first 10

})


function overall_func(category) {

  tab_clicked.value = category;

  const all_tabs = document.querySelectorAll(".router_link");

  all_tabs.forEach((tab) => {
  
  tab.style = tab.id === tab_clicked.value ? `background-color: var(--primary-blue); color: white` : "";
  
  });
  
}



</script>

<style scoped>
/* GENERAL STYLES */
* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

.tawk-min-container {
    display: none !important; /* Adjust distance from the right */
  }

div.home_container {
    margin: 0px;
}

/* SECTION 1 */
.section1 {
  position: relative;
  margin: 0;
  width: 100%;
  padding: 15px 15px;
  background-image: url('../assets/static_images/hero-gadgets.png');
  background-size: cover;       /* make image cover full section */
  background-position: center;  /* keep image centered */
  background-repeat: no-repeat; /* prevent tiling */
  background-attachment: fixed; /* gives subtle parallax on desktop */
}

.section1_overlay {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  margin: 0;
  width: 100%;
  background: var(--transparent-blue);
  height: 100%;
  cursor: pointer;
}

.section1 .info {
  position: relative;
  z-index: 2;
}

.section1 h2 {
   font-size: 20px;
   font-weight: bold;
   color: var(--primary-blue);
}

.section1 h1 {
   font-size: 33px;
   margin: 20px 0;
   color: var(--primary-white);
}

.section1 p {
   font-size: 20px;
   margin: 20px 0;
   color: rgb(196, 196, 196);
}

#browse_product {
   text-decoration: none;
   display: block;
   border: 1px solid var(--primary-blue);
   color: var(--primary-blue);
   padding: 10px 0;
   width: 100%;
   text-align: center;
   margin: 20px auto;
   border-radius: 12px;
   background-color: var(--primary-black);
}

#browse_product:hover {
   border: 1px solid var(--primary-blue);
   color: var(--primary-white);
   background-color: var(--primary-blue);
   transition: 1s;
}

.section1 img {
  display: block;
  position: relative;
  z-index: 2;
  border-radius: 20px;
  object-fit: cover; /* ✅ key change */
  width: 100%;
  height: 300px;
  margin: 40px auto;
}


.section2 {
  padding: 30px 15px;
  background-color: var(--primary-black);
}

.cards {
  gap: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.card {
  text-align: center;
  background-color: var(--secondary-black);
  padding: 20px;
  color: var(--primary-white);
  border-radius: 15px;
  border: 1px solid var(--secondary-white);
}

.card h2 {
  font-size: 15px;
  font-weight: bold;
  margin: 8px 0;
}

.card p {
  font-size: 14px;
  margin: 8px 0;
  color: rgb(141, 139, 139);
}

.featured_products  {
  text-align: center;
  margin-top: 80px;
}

.featured_products h1{
  color: var(--primary-white);
  font-size: 23px;
  margin: 12px 0;
  font-weight: bold;
}

.featured_products p{
  color: var(--secondary-white);
  font-size: 17px;
  margin: 12px 0;
}

div.categories{
    overflow-x: auto;
    white-space: nowrap;
    margin: 25px auto;
}

div.categories .router_link{
    cursor: pointer;
    white-space: normal;
    display: inline-block;
    text-align: center;
    padding: 8px 12px;
    color: var(--primary-white);
    font-size: 13px;
    border: 1px solid var(--secondary-white);
    margin: 0px 20px 10px 0px;
    background-color: var(--primary-black);
    border-radius: 20px;
    font-weight: bold;
    text-transform: capitalize;
    text-decoration: none;
}

div.categories .router_link:hover{
    background-color: var(--primary-blue);
    color: white;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

.view_products {
    padding: 10px;
    border: 1px solid var(--secondary-white);
    border-radius: 15px;
    text-decoration: none;
    display: block;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    color: var(--primary-white);
    margin: 40px auto;
    width: 50%;
    transition: 0.6s;
}

.view_products:hover {
    background-color: var(--primary-blue);
}

/* DESKTOP DEVICES */
@media only screen and (min-width: 765px) {
  .section1 {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 20px;
  }

  .section1 h2 {
   font-size: 20px;
   font-weight: bold;
   color: var(--primary-blue);
}

.section1 h1 {
   font-size: 50px;
   margin: 20px 0;
   color: var(--primary-white);
}

.section1 p {
   font-size: 20px;
   margin: 20px 0;
   color: rgb(196, 196, 196);
}

.section1 img, .section1 .info {
  width: 50%;
}

#browse_product {
   width: 50%;
   margin-left: 0;
   margin-right: 0;
}

.cards {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.featured_products h1{
  font-size: 27px;
}

.featured_products p{
  font-size: 18px;
}

div.categories{
  overflow-x: auto;
  white-space: nowrap;
  margin: 25px 0;
  text-align: left;
}

.view_products {
  width: 200px;
  font-size: 14px;
}
}
</style>