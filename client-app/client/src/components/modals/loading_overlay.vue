<template>
  <div class="overlay" v-if = "interactive_store.display_loading_overlay">
    <font-awesome-icon class="fa-solid fa-spinner" id="spinner" icon="fa-solid fa-spinner" />
  </div>
</template>

<script setup>

import { useInteractiveStore } from '@/stores/interactive'

const interactive_store = useInteractiveStore()

</script>

<style scoped>
  div.overlay {
    background-color: black;
    opacity: 0.5;
    position: fixed;
    top: 0;
    z-index: 1000;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #spinner {
    font-size: 3rem;
    color: white;
    animation: spin 2s linear infinite; /* Manually add spin animation */
  }

  /* Spin animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
