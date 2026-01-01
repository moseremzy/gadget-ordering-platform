<template>
  <div class="container" :style="interactive_store.container_css">

    <OVERLAY />

    <SUCCESSALERTBOX>{{ interactive_store.backend_message }}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{ interactive_store.backend_message }}</ERRORALERTBOX>

    <!-- Side bar -->
    <SIDEBAR />

    <div class="sub_container" :style="interactive_store.sub_container_css">
       
      <HEADER page_name="dashboard" />

      <h1>Analytics</h1>

      <!-- Circular Orders Section -->
      <div>
        <h2>Orders</h2>
        <div class="status-circles">
          <div class="status-circle" style="background-color: gray;">
            <span class="status-title">Pending</span>
            <span class="status-count">{{ pendingOrders.length }}</span>
          </div>

          <div class="status-circle" style="background-color: #007BFF;">
            <span class="status-title">Confirmed</span>
            <span class="status-count">{{ confirmedOrders.length }}</span>
          </div>

          <div class="status-circle" style="background-color: #6F42C1;">
            <span class="status-title">Out for Delivery</span>
            <span class="status-count">{{ outforDeliveryOrders.length }}</span>
          </div>

          <div class="status-circle" style="background-color: #28A745;">
            <span class="status-title">Delivered</span>
            <span class="status-count">{{ deliveredOrders.length }}</span>
          </div>

          <div class="status-circle" style="background-color: red;">
            <span class="status-title">Cancelled</span>
            <span class="status-count">{{ cancelledOrders.length }}</span>
          </div>
        </div>
      </div>
    <!-- Circular Orders Section -->

    <hr>

    <!-- Circular Customers Section -->
      <div>
        <h2>Customers</h2>
        <div class="status-circles">

          <div class="status-circle" style="background-color: #28A745;">
            <span class="status-title">Verified Customers</span>
            <span class="status-count">{{ verifiedCustomers.length }}</span>
          </div>

          <div class="status-circle" style="background-color: red;">
            <span class="status-title">Unverified Customers</span>
            <span class="status-count">{{ unverifiedCustomers.length }}</span>
          </div>
        </div>
      </div>
    <!-- Circular Customers Section -->

   <hr>

    <!-- Circular REVENUE Section -->
      <div>
        <h2>All Time Revenue</h2>
        <div class="status-circles">

          <div class="status-circle" style="background-color: #28A745;">
            <span class="status-count" style = "font-weight: bold; font-size: 20px;">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(revenue)}}</span>
          </div>

        </div>
        <ChartComponent title = "Revenue"/>
      </div>
    <!-- Circular REVENUE Section -->

    </div> <!-- SUB_CONTAINER -->
  </div> <!-- CONTAINER -->
</template>

<script setup>
import OVERLAY from "../components/modals/loading_overlay.vue";
import ChartComponent from '../components/charts/ChartComponent.vue';
import { useInteractiveStore } from '@/stores/interactive'
import { useOrdersStore } from '@/stores/orders'
import { useCustomersStore } from '@/stores/customers'
import { useAdminStore } from '@/stores/admin'
import HEADER from "../components/Header.vue";
import { useRoute, useRouter } from 'vue-router'
import SIDEBAR from "../components/SideBar.vue"; 
import { ref, computed, watch } from "vue";

const interactive_store = useInteractiveStore()

const orders_store = useOrdersStore()

const customers_store = useCustomersStore()

const admin_store = useAdminStore()

const route = useRoute()
const router = useRouter()



watch( () => admin_store.isAuthenticated,

  (isAuthenticated) => { //i dey confirm if admin still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_success_alert_box(true)

        setTimeout(() => {

           router.push({ path: "/login" })
            
        }, 1000);

    }
  }, 
);


let pendingOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "pending"

    })
    
})


let confirmedOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "confirmed"

    })
    
})


let preparingOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "preparing"

    })
    
})



let outforDeliveryOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "out for delivery"

    })
    
})



let deliveredOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "delivered"

    })
    
})


let cancelledOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "cancelled"

    })
    
})


let returnedOrders = computed(() => {  

    return orders_store.orders.filter((order) => {

      return order.order_status == "returned"

    })
    
})




let verifiedCustomers = computed(() => {  

    return customers_store.all_customers.filter((customer) => {

      return customer.account_status == "Verified"

    })
    
})


let unverifiedCustomers = computed(() => {  

    return customers_store.all_customers.filter((customer) => {

      return customer.account_status == "Unverified"

    })
    
})


let revenue = computed(() => {  

        let revenue_total = 0

        orders_store.orders.forEach(order => {

            if (order.order_status === 'delivered' && order.payment_status === 'success') {
            
              revenue_total += order.total_amount
              
            }
            
        })

        return revenue_total;
})



</script>

<style scoped>
/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
  body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif;
    background-color: rgb(225, 230, 231);
  }
  div.container {
    display: flex;
    height: auto;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  div.sub_container {
    display: block;
    margin: 0;
    padding: 0 15px 90px 15px;
    width: 100%;
  }
  div.sub_container h1 {
    margin: 0px auto 25px auto;
    color: #0e2e45;
    font-size: 3rem;
    font-weight: 300;
  }
}
/* MOBILE VIEW */

/* Style for the status circles */
h2 {
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.status-circles {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  justify-content: center;
}

.status-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.status-circle:hover {
  transform: scale(1.1); /* Increase the size on hover */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* Enhanced shadow on hover */
}

.status-title {
  font-size: 1.5rem;
  font-weight: lighter;
}

.status-count {
  font-size: 1.5rem;
}

/* DESKTOP VIEW */
@media only screen and (min-width: 992px) {
  body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", "Helvetica Neue", "Helvetica", Arial, sans-serif;
    background-color: rgb(225, 230, 231);
  }
  div.container {
    display: flex;
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  div.sub_container {
    display: block;
    margin: 0 0 0 250px;
    height: 100vh;
    padding: 0 15px 90px 15px;
    width: 100%;
    overflow-y: auto;
    width: calc(100% - 250px);
  }
  div.sub_container h1 {
    margin: 0px auto 25px auto;
    color: #0e2e45;
    font-size: 35px;
    font-weight: 300;
  }
}
/* DESKTOP VIEW */
</style>
