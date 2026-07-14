<template>
  <div>
    <HEADER/> 
    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>
    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>
    <LoadingOverlay/>
    <ErrorModal>{{interactive_store.backend_message}}</ErrorModal>
    <SEARCHRESULT/>
    <SIDEBAR/>
    <div class="auth-container">
      <div class="auth-box">
        <h2>Welcome to <span class="brand">TechbyCas.com</span></h2>
        <p class="subtitle">
          Log in or create an account to begin your shopping experience
        </p>

        <!-- GOOGLE SIGN IN -->
        <button class="google-btn" @click="loginWithGoogle">
          <svg class="google-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- DIVIDER -->
        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">or</span>
          <span class="divider-line"></span>
        </div>

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
import Register from "@/components/Register.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch } from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import { useInteractiveStore } from '@/stores/interactive'
import { useSettingStore } from '@/stores/settings'
import API from '../api/index'
const interactive_store = useInteractiveStore()
const settings_store = useSettingStore()

let currentTab = ref("Login");

const tabs = reactive({
  Login: Login,
  Register: Register,
});
 
async function loginWithGoogle() {
    
  window.location.href = `${window.location.origin}/api/auth/google`;

}

onMounted(() => {
  MIDDLEWARES.allowScroll()
})

onUpdated(() => {
  MIDDLEWARES.allowScroll()
})
</script>

<style scoped>
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

/* GOOGLE BUTTON */
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fff;
  color: #3c3c3c;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-family);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  letter-spacing: 0.01em;
  margin-bottom: 4px;
}

.google-btn:hover {
  background: #f7f7f7;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}

.google-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

.google-logo {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* DIVIDER */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #2a2a2a;
}

.divider-text {
  font-size: 12px;
  color: #555;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* TABS */
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

/* RESPONSIVE */
@media (max-width: 480px) {
  .auth-box {
    padding: 20px;
  }
}
</style>