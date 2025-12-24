<template>

 <div>

 <HEADER/> 

 <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

 <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

 <SEARCHRESULT/>

 <SIDEBAR/>

<div class = "home_container">

  <h1>#Order{{orders_store.current_order_id}}</h1>

  <div class="order-details">

  <!-- Order Summary -->
  <div class="order-summary">
    <div><strong>Order ID:</strong> #{{ orders_store.current_order[0]?.order_id }}</div>
    <div :class="`status ${orders_store.current_order[0]?.order_status}`"><strong>Status:</strong> {{ orders_store.current_order[0]?.order_status }}</div>
    <div><strong>Created:</strong> {{MIDDLEWARES.formatted_date(orders_store.current_order[0]?.created_at)}}</div>
    <div><strong>Total Amount:</strong> {{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(orders_store.current_order[0]?.total_amount)}}</div>
  </div>

  <!-- Order Items Table -->
  <div class="order-table-wrapper">
    <table class="order-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in orders_store.current_order" :key="index">
          <td class="product-info">
            <img :src="item.main_image" alt="" />
            <div class="p-name">{{ item.name }}</div>
          </td>

          <td>{{ item.quantity }}</td>

          <td>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.price)}}</td>

          <td>{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(item.quantity * item.price )}}</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
     
</div>

   <WHATSAPP/>

 <FOOTER/>

</div>
</template>

<script setup>
import SEARCHRESULT from "@/components/SearchResult.vue";
import HEADER from "@/components/Header.vue";
import SIDEBAR from "@/components/Sidebar.vue";
import FOOTER from "@/components/Footer.vue";
import { useRoute, useRouter } from 'vue-router'
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import API from "@/api";
import { useInteractiveStore } from '@/stores/interactive'
import { useUserStore } from '@/stores/user' 
import { useOrdersStore } from '@/stores/orders'
const interactive_store = useInteractiveStore()

const route = useRoute()
const router = useRouter()

const user_store = useUserStore()

const orders_store = useOrdersStore()

if (!user_store.isAuthenticated) { //if user no get session redirect to login

    interactive_store.set_page_to_go('profile')

    router.push({ name: "sign-in" })

}


watch( () => user_store.isAuthenticated,

  (isAuthenticated) => { //i dey confirm if user still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_error_alert_box(true)

        setTimeout(() => {

           router.push({ path: "sign-in" })
            
        }, 1000);

    }
  }, 
);

onMounted(() => {
  
  orders_store.current_order_id = route.params.order_id

})

</script>

<style scoped>
* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
}

div.home_container {
    margin: 0px;
    padding: 20px;
    background-color: var(--primary-black);
}

div.home_container h1{
    margin: 5px 0;
    color: var(--primary-blue);
} 

.order-details {
  margin-top: 20px;
  padding: 20px;
  background: #101010;
  border-radius: 10px;
  color: white;
}

/* ORDER SUMMARY */
.order-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  background: #1a1a1a;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #2b2b2b;
}

.order-summary div {
  font-size: 14px;
}

/* TABLE */
.order-table-wrapper {
  overflow-x: auto;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
}

.order-table thead {
  background: var(--primary-blue);
}

.order-table th {
  padding: 12px;
  font-size: 14px;
  color: #fff;
  text-align: left;
}

.order-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #2c2c2c;
  font-size: 14px;
}

/* PRODUCT CELL */
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-info img {
  width: 55px;
  height: 55px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #333;
}

.p-name {
  font-weight: 600;
  max-width: 180px;
}

.status {
  padding: 0px 0px;   
  border-radius: 12px;
}

.status.delivered {
  color: #2bff8a;
}

.status.pending {
  color: #d4af37;
}

.status.processing {
  color: #ffa500;
}

.status.cancelled {
  color: #ff3244;
}

/* MOBILE */
@media(max-width: 600px) {

  .order-details {
    padding: 15px;
  }

  .order-table th,
  .order-table td {
    font-size: 12px;
    padding: 10px;
  }

  .product-info img {
    width: 45px;
    height: 45px;
  }

  .p-name {
    font-size: 12px;
  }

}

</style>