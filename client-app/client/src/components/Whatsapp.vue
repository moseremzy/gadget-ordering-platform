<template>
  <div>
    <!-- WhatsApp Floating Button -->
    <a
      href="https://wa.me/2347063131606"
      target="_blank"
      class="whatsapp-float"
      aria-label="Chat with us on WhatsApp"
    >
      <font-awesome-icon icon="fa-brands fa-whatsapp" />
    </a>
  </div>
</template>

<style scoped>
/* WhatsApp Floating Button */
.whatsapp-float {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 100px;
  right: 20px;
  background-color: #25d366;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  z-index: 1000;
  font-size: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
</style>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>
