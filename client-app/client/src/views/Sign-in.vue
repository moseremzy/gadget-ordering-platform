<template>
  <div>
    <HEADER/> 
    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
    <LoadingOverlay/>
    <ErrorModal>{{interactive_store.backend_message}}</ErrorModal>
    <!-- <SuccessModal>hello</SuccessModal> -->
    <SEARCHRESULT/>
    <SIDEBAR/>

  <div class="auth-container">
    <div class="auth-box">
      <h2>Welcome to <span class="brand">TechbyCas.com</span></h2>
      <p class="subtitle">
        Log in or create an account to begin your shopping experience
      </p>

             <!-- Tabs -->
        <div class="tab-container">
          <button
            v-for="(component, name) in tabs"
            :key="name"
            class="tab"
            :class="{ active: currentTab === name }"
            @click="currentTab = name"
          >
            {{ name }}
          </button>
        </div>

        <!-- Render selected tab component -->
        <component :is="tabs[currentTab]" />

      
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
import LoadingOverlay from "../components/modals/loading_overlay.vue";
import ErrorModal from "../components/modals/ErrorModal.vue";
import SuccessModal from "../components/modals/SuccessModal.vue";
import FOOTER from "@/components/Footer.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue"; // Make sure you have this file
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import { useInteractiveStore } from '@/stores/interactive'

const interactive_store = useInteractiveStore()

let currentTab = ref("Login");

const tabs = reactive({
  Login: Login,
  Register: Register,
});

/* Hooks */

onMounted(() => {
    
    MIDDLEWARES.allowScroll()

})


onUpdated(() => {

    MIDDLEWARES.allowScroll()
    
})


</script>

<style scoped>
/* GENERAL STYLES */
* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #121212;
  padding: 50px 20px;
}

.auth-box {
  background: #1a1a1a;
  color: #fff;
  border-radius: 14px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}

.brand {
  color: var(--primary-blue);
}

.subtitle {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 25px;
}

/* Tabs */
.tab-container {
  display: flex;
  background: #111;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid #333;
}
.tab {
  flex: 1;
  padding: 10px 0;
  background: transparent;
  border: none;
  color: #888;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-box {
    padding: 20px;
  }
}
</style>