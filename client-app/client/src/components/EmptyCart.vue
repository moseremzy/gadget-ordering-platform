<template>
  <div>
    <font-awesome-icon class="fa-regular fa-cart-shopping" id = "cart"  icon="fa-solid fa-cart-shopping"/>
    <h1>No Items In Cart</h1>
    <router-link to = "/shop" id = 'link'>Add item</router-link>
  </div>
</template>

<script setup>
  
</script>

<style scoped>
   div {
       margin: 40px 0 0 0;
       text-align: center;
   }
   #cart {
       border: 0;
       padding: 30px;
       background-color: rgba(214, 214, 214, 0.986);
       border-radius: 50%;
       color: rgb(111, 136, 128);
       font-size: 50px;
   }
   h1 {
       color: rgb(95, 95, 95);
       font-size: 18px;
       margin: 13px 0 0 0;
   }
   #link {
       text-decoration: none;
       color: white;
       display: inline-block;
       background-color: var(--primary-blue);
       padding: 7px 12px;
       border-radius: 12px;
       margin: 15px 0;
       font-weight: bold;
   }
</style>