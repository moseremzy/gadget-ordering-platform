<template>
  <div class = "no_orders">
    <font-awesome-icon class="fa-solid fa-box-open" id = "box"  icon="fa-solid fa-box-open"/>
    <h1>No orders yet</h1>
    <p>You haven't placed any orders yet. Start shopping.</p>
    <router-link class = "link" href="/products">View Products</router-link>
  </div>
</template>

<script setup>
  
</script>

<style scoped>
   .no_orders {
       margin: 40px 0 0 0;
       text-align: center;
   }
   #box {
       color: rgb(111, 136, 128);
       font-size: 60px;
   }
   h1 {
       color: var(--primary-white);
       font-size: 20px;
       margin: 10px 0 0 0;
   }
   p {
      color: rgb(128, 119, 119);
      margin-top: 8px;
   }
   .link {
      text-decoration: none;
      color: var(--primary-white);
      padding: 8px 12px;
      margin-top: 8px;
      display: inline-block;
      border: 1px solid var(--primary-blue);
      background-color: var(--primary-blue);
      border-radius: 12px;
   }
</style>