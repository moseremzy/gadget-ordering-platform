<template>
  <div>
    <!-- ========= MOBILE SIDEBAR ========= -->
    <div class="main_nav_container" v-if="interactive_store.display_main_nav">
      <div class="header">
        <p>
          <font-awesome-icon
            @click="interactive_store.toggle_main_nav(false)"
            class="fa-solid fa-xmark"
            id="xmark"
            icon="fa-solid fa-xmark"
          />
        </p>
      </div>

      <div class="section">
        <h1>Menu</h1>
        <ul>
          <li @click="interactive_store.toggle_main_nav(false)">
            <router-link to="/" class="link" exact-active-class="active-link">Home</router-link>
          </li>
          <li @click="interactive_store.toggle_main_nav(false)">
            <router-link to="/shop" class="link" exact-active-class="active-link">Shop</router-link>
          </li>
          <li @click="interactive_store.toggle_main_nav(false)">
            <router-link to="/contact" class="link" exact-active-class="active-link">Contact</router-link>
          </li>
        </ul>
      </div>

      <hr class="divider" />

      <div class="section categories">
        <h2>Categories</h2>
        <ul>
          <li 
          v-for="category in categories"
          :key="category.category_id"
          @click="store.toggle_main_nav(false)">
          <router-link 
          :to="`/shop?category=${category.name}`" 
          class="link">{{category.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Overlay for Mobile Sidebar -->
    <div class="hide_main_nav" @click="interactive_store.toggle_main_nav(false)" v-if="interactive_store.display_main_nav"></div>

    <!-- ========= DESKTOP NAVBAR ========= -->
    <div class="desktop_nav">
       <div class="nav-left">
        <router-link 
          v-for="category in categories"
          :key="category.category_id"
          :to="`/shop?category=${category.name}`" 
          class="nav-link"
          >{{category.name}}
        </router-link>
       </div>
      <div class="nav-right">
        <router-link to="/" class="nav-link" exact-active-class="active-link">Home</router-link>
        <router-link to="/shop" class="nav-link" exact-active-class="active-link">All Products</router-link>
        <router-link to="/contact" class="nav-link" exact-active-class="active-link">Contact</router-link>
        <font-awesome-icon icon="fa-solid fa-moon" class="nav-icon" />
      </div>
    </div> 
  </div>
</template>

<script setup>
import { useInteractiveStore } from "@/stores/interactive";
import { useUserStore } from "@/stores/user";
import { onMounted, onUnmounted, onUpdated, computed, reactive, toRaw, ref, watch} from 'vue'
import { useCategoriesStore } from "@/stores/categories";
import API from "../api";

const user_store = useUserStore();
const interactive_store = useInteractiveStore();
const categories_store = useCategoriesStore()


const categories = computed(() => {

 return categories_store.categories

})


async function logout() {

  const response = await API.logout();
  
  if (response.message === "success") {
    
    user_store.logged_Out();
    
    window.location.assign("/login");
  
  } else {
    
    window.location.assign("/");
  
  }

}
</script>

<style scoped>
/* RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-family);
}

/* ACTIVE LINK */
.active-link {
  color: var(--primary-blue) !important;
  font-weight: 600;
}

/* ================= MOBILE SIDEBAR ================= */
.main_nav_container {
  position: fixed;
  top: 0;
  left: 0;
  width: 70%;
  max-width: 320px;
  height: 100vh;
  border: 1px solid var(--primary-white);
  background-color: var(--secondary-black);
  color: var(--primary-white);
  z-index: 3000;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: slideIn 0.4s ease forwards;
  border-right: 1px solid var(--secondary-white);
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.header p {
  cursor: pointer;
  font-size: 18px;
  color: #aaa;
  transition: color 0.3s ease, transform 0.3s ease;
}

.header p:hover {
  color: #fff;
  transform: rotate(90deg);
}

.section {
  margin-top: 22px;
}

.section h1 {
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 40px;
}

.section h2 {
  font-size: 15px;
  font-weight: 600;
  color: #c33131;
  margin-bottom: 16px;
  letter-spacing: 0.6px;
}

ul {
  list-style: none;
}

ul li {
  margin: 12px 0;
}

.link,
.section ul li a {
  display: block;
  text-decoration: none;
  color: #dcdcdc;
  font-size: 18px;
  padding: 3px 0;
  transition: color 0.3s ease, transform 0.3s ease;
}

.link:hover,
.section ul li a:hover {
  color: #fff;
  transform: translateX(4px);
}

.categories ul li a {
  display: block;
  text-decoration: none;
  color: #dcdcdc;
  font-size: 13px;
  padding: 6px 0;
  transition: color 0.3s ease, transform 0.3s ease;
}

.divider {
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.12);
}

.hide_main_nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  cursor: pointer;
}

/* ========== ANIMATIONS ========== */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scrollbar */
.main_nav_container::-webkit-scrollbar {
  width: 6px;
}
.main_nav_container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.main_nav_container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ================= DESKTOP NAV ================= */
@media only screen and (min-width: 765px) {
  .main_nav_container,
  .hide_main_nav {
    display: none;
  }

  .desktop_nav {
    width: 100%;
    background-color: var(--secondary-black);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 60px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .nav-link {
    color: var(--primary-white);
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .nav-link:hover {
    color: #00aeff;
  }

  .nav-icon {
    color: var(--primary-white);
    font-size: 16px;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .nav-icon:hover {
    color: #00aeff;
    transform: scale(1.1);
  }
}


/* ================= DESKTOP NAV ================= */
@media only screen and (max-width: 765px) {
.desktop_nav {
  display: none;
}
}
</style>
