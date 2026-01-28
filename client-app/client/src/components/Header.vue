<template>
<div class="header_container">
    <div class="header">

      <!-- Mobile Hamburger -->
      <div class="hamburger-icon">
        <font-awesome-icon
          class="fa-solid fa-navicon icons"
          @click="interactive_store.toggle_main_nav(true)"
          icon="fa-solid fa-navicon"
        />
      </div>

      <!-- Logo -->
      <div class="logo">
        <router-link to="#">
          <img src="../assets/static_images/logo.png" id="logo" alt="Logo" />
        </router-link>
      </div>

       <!-- Searchbox in center (desktop only) -->
      <div class="desktop-searchbox">
        <SEARCHBOX />
      </div>

      <!-- Right Side Icons -->
      <div class="header-right">

        <!-- Cart -->
        <router-link to="/cart" class="icon-wrapper">
          <font-awesome-icon class="fa-solid fa-cart-shopping icons" icon="fa-solid fa-cart-shopping" />
          <b id="cart_length" v-if="products_store.total_cart_products > 0">
            {{ products_store.total_cart_products }}
          </b>
        </router-link>

        <!-- User Icon + Dropdown -->
        <div class="profile-wrapper" v-if="user_store.isAuthenticated">
          <div class="icon-wrapper" @click="toggleDropdown">
            <font-awesome-icon class="fa-solid fa-user icons" icon="fa-solid fa-user" />
          </div>

          <div class="dropdown" v-if="showDropdown">
            <router-link to="/account/profile" class="dropdown-item">My Profile</router-link>
            <div class = "dropdown-divider"></div>
            <router-link to ="#" class="dropdown-item logout" @click="logout">Logout <font-awesome-icon class="fa-solid fa-sign-out" icon="fa-solid fa-sign-out" /></router-link>
          </div>
        </div>

        <!-- Sign In (If not logged in) -->
        <router-link to="/sign-in" class="icon-wrapper icons" style="padding: 8px; margin: 0;" v-else>
          Sign In
        </router-link>

      </div>
    </div>

    <!-- Searchbox below header (mobile only) -->
    <div class="mobile-searchbox">
      <SEARCHBOX />
    </div>
  </div>
</template>

<script setup>
import SEARCHBOX from "@/components/SearchBox.vue";
import { ref } from "vue";
import { useInteractiveStore } from "@/stores/interactive";
import { useProductStore } from "@/stores/products";
import { useUserStore } from '@/stores/user';
import API from "../api/index.js";

const user_store = useUserStore();
const interactive_store = useInteractiveStore();
const products_store = useProductStore();

const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};


async function logout() {

  try {

   interactive_store.toggle_loading_overlay(true)

   const response = await API.logout()

   user_store.logged_Out()

   interactive_store.backend_message = "Logged out successfully"

   interactive_store.display_success_alert_box();

   window.location.assign("/")

  } catch (error) {

    console.log(error)
    
  }

  interactive_store.toggle_loading_overlay(false)

}
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
}

.logo a img {
  width: 110px;
  height: 65px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo a img:hover {
  transform: scale(1.03);
}

.icons {
  color: var(--primary-white);
  font-size: 13px;
  box-sizing: border-box;
  font-weight: bold;
  text-decoration: none;
  background-color: var(--primary-black);
  border: 1px solid var(--secondary-white);
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.icons:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px; /* space between icons */
}

#cart_length {
  position: relative;
  top: -27px;
  left: -6px;
  color: var(--primary-white);
  background-color: #00aeff;
  border-radius: 100%;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.profile-wrapper {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: var(--secondary-black);
  border: 1px solid var(--secondary-white);
  border-radius: 8px;
  min-width: 160px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  padding: 8px 0;
  animation: fadeIn 0.2s ease;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 10px 15px;
  align-items: center;
  font-size: 14px;
  color: var(--primary-white);
  text-decoration: none;
  cursor: pointer;
}

.logout {
  color: red;
}

.fa-sign-out {
  margin-left: 8px;
}

.dropdown-item:hover {
  background-color: #1f1f1f;
}

.dropdown-divider {
  height: 1px;
  background-color: #444;
  margin: 6px 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}


/* ========== MOBILE (≤765px) ========== */
@media only screen and (max-width: 765px) {
  .header_container {
    width: 100%;
    padding: 10px 14px;
    background-color: var(--secondary-black);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;    
  }

  /* Hide searchbox in header on mobile */
  .desktop-searchbox {
    display: none;
  }

  /* Show searchbox below header on mobile */
  .mobile-searchbox {
    display: block; /* Adjust based on header height */
    padding: 0px 14px;
    margin:0px;
  }
}

/* ========== DESKTOP (≥765px) ========== */
@media only screen and (min-width: 765px) {
  .header_container {
    display: flex;
    flex-direction: column;
    z-index: 100;
    width: 100%;
    padding: 5px 60px;
    background-color: var(--secondary-black);
    box-shadow: 0 2px 8px #00000040;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Hide hamburger icon on desktop */
  .hamburger-icon {
    display: none;
  }

  /* Logo floated to left */
  .logo {
    flex: 0 0 auto;
  }

  .logo a img {
    width: 130px;
    height: 75px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .logo a img:hover {
    transform: scale(1.05);
  }

  /* Searchbox in center */
  .desktop-searchbox {
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: 500px;
    margin: 0 20px;
  }

  /* Hide mobile searchbox on desktop */
  .mobile-searchbox {
    display: none;
  }
}
</style>