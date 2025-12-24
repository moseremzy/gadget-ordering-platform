<template>
  <div v-if="interactive_store.display_error_modal">
    <div class="modal-backdrop" @click.prevent="interactive_store.display_error_modal_box(false)"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true">
      <button class="close-button" @click.prevent="interactive_store.display_error_modal_box(false)" aria-label="Close">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
      <h3>Error</h3>
      <p><slot></slot></p>
      <button class="confirm-button" @click.prevent="interactive_store.display_error_modal_box(false)">OK</button>
    </div>
  </div>
</template>

<script setup>
import { useInteractiveStore } from '@/stores/interactive'
const interactive_store = useInteractiveStore()
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65); /* darker for deep contrast */
  backdrop-filter: blur(2px);       /* soft blur for premium feel */
  z-index: 10;
}

.modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 90%;
  max-width: 420px;
  background: #1c1b1b; /* matches --primary-black but slightly lighter */
  border-radius: 12px;
  padding: 2.2rem 1.8rem 2rem;
  transform: translate(-50%, -50%);
  z-index: 20;
  text-align: center;

  /* elevates above dark background */
  box-shadow: 0 12px 45px rgba(0, 0, 0, 0.35);

  border: 1px solid rgba(255, 255, 255, 0.05); /* subtle border */
}

.modal-dialog h3 {
  margin-bottom: 0.8rem;
  font-weight: 600;
  font-size: 18px;
  color: #ff6b6b; /* soft error red */
}

.modal-dialog p {
  color: #e2e2e2;
  line-height: 1.55;
  margin-bottom: 1.8rem;
}

.confirm-button {
  background-color: #ff4a4a;  /* brighter clean red */
  color: #fff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: 0.25s ease;
}

.confirm-button:hover {
  background-color: #e93636;
  transform: translateY(-2px);
}

.close-button {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 1.4rem;
  cursor: pointer;
  transition: 0.25s ease;
}

.close-button:hover {
  color: #e93636;
  transform: rotate(90deg);
}
</style>
