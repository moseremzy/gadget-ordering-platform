<template>

  <div class="container" :style = "interactive_store.container_css">

    <LoadingOverlay/>

    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

  <!--side bar--> <SIDEBAR/>

     <div class="sub_container" :style = "interactive_store.sub_container_css">

      <!--header--> <HEADER page_name = "dashboard" />

        <h1>Dashboard</h1>

         <div class = "grid1">

          <div class = "flex_items" style="background-color:  #835AEE;">
            <router-link to = "#" style = "text-decoration: none;">
            <p>TOTAL ORDERS</p>
            <h1>{{orders_store.total_orders}}</h1>
            <hr>
            <small>All Orders</small>
            </router-link>
          </div>

          <div class = "flex_items" style="background-color: rgb(18, 170, 170);">
            <p>TOTAL GADGETS</p>
            <h1>{{products_store.total_products}}</h1>
            <hr>
            <small>All Products</small>
          </div>

         <div class = "flex_items" style="background-color:  green;">
            <p>TOTAL REVENUE</p>
            <h1>{{ new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(orders_store.revenue)}}</h1>
            <hr>
            <small>Completed Orders</small>
          </div>
           
          <div class = "flex_items" style="background-color:  rgb(175, 18, 18);">
            <router-link to = "#" style="text-decoration: none;">
            <p>TOTAL CUSTOMERS</p>
            <h1>{{customers_store.total_customers}}</h1>
            <hr>
            <small>Tech By Cas Users</small>
            </router-link>
          </div> 
        </div>   <!-- GRID 1 -->

        <div class = "grid2">

          <ChartComponent title = "Orders"/>

          <ChartComponent title = "Revenue"/>

        </div>  

    <div class = "order_category">
        <router-link to = "#" id = "pending" @click.prevent = "overall_func('pending', 'run_scroll')" class = "category_link" style>Pending</router-link>
        <router-link to = "#" id = "active" @click.prevent = "overall_func('active', 'run_scroll')" class = "category_link" style>Active</router-link>
    </div>
 
    <ORDERLIST :orders = "filteredOrders" :order_items = "filteredOrderItems" :category = tab_clicked class = "scroll_to_section"/>

    </div> <!-- SUB_CONTAINER -->

    </div> <!-- CONTAINER -->
    
</template>

<script setup>
import ChartComponent from '../components/charts/ChartComponent.vue';
import ORDERLIST from '../components/OrderList.vue';
import LoadingOverlay from '../components/modals/loading_overlay.vue';
import HEADER from '../components/Header.vue';
import SIDEBAR from '../components/SideBar.vue';
import { onMounted, onUnmounted, onUpdated, reactive, computed, toRaw, ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInteractiveStore } from '@/stores/interactive'
import { useProductStore } from '@/stores/products'
import { useAdminStore } from '@/stores/admin'
import { useOrdersStore } from '@/stores/orders'
import { useCustomersStore } from '@/stores/customers'

const interactive_store = useInteractiveStore()
const products_store = useProductStore()
const admin_store = useAdminStore()
const orders_store = useOrdersStore()
const customers_store = useCustomersStore()

let tab_clicked = ref("");
 
const route = useRoute()
const router = useRouter()

if (!admin_store.isAuthenticated) { //if user no get session redirect to login

    router.push({ path: "/login" })

}

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


let filteredOrders = computed(() => { //search for orders

    if (tab_clicked.value === "pending") {

    return orders_store.orders.filter((order) => {

    return order.order_status === tab_clicked.value;

    })
        
} else {

    return orders_store.orders.filter((order) => {

    return order.status !== "Payment pending" && order.status !== "Payment Failed" && order.status !== "Payment Abandoned" && order.status !== "Payment Reversed" && order.status !== "pending" && order.status !== "Cancelled" && order.status !== "Delivered";

  })

}

})



let filteredOrderItems = computed(() => { //search for orders

    if (tab_clicked.value === "pending") {

    return orders_store.order_items.filter((order) => {

    return order.order_status === tab_clicked.value;

    })
        
} else {

    return orders_store.order_items.filter((order) => {

    return order.status !== "Payment pending" && order.status !== "Payment Failed" && order.status !== "Payment Abandoned" && order.status !== "Payment Reversed" && order.status !== "pending" && order.status !== "Cancelled" && order.status !== "Delivered";

  })

}

})



onMounted(() => {

  overall_func('pending')

})



function overall_func(category, run_scroll) {

    tab_clicked.value = category; //make default be all

    let all_tabs = document.querySelectorAll(".category_link");

    let counter = 0;

    while (counter < all_tabs.length) {

        if (all_tabs[counter].id !== tab_clicked.value) {
        
            all_tabs[counter].style = ""

        } else {

            all_tabs[counter].style = "border-bottom: 2px solid rgb(0, 102, 255)"

        }

        counter++;

    }

   run_scroll ? scrollTo() : null //only if user click on the button na u go run scrooltto function

}


function scrollTo() {

    const scroll_to_section = document.querySelectorAll('.scroll_to_section');
    
    if (scroll_to_section.length > 0) {

    scroll_to_section[0].scrollIntoView({

        behavior: 'smooth',

        block: 'start',

    });

  }
}


</script>

<style scoped>
/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
body {
    margin: 0;
    padding: 0;
    font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
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
    margin:0;
    padding: 0 15px 90px 15px;
    width: 100%; /*calc(100% - 250px)*/;
}
div.sub_container h1{
    margin: 0px auto 25px auto;
    color: #0E2E45;
    font-size: 3rem;
    font-weight: 300;
}
div.grid1 {
    width: 100%;
    display: grid;
    box-sizing: border-box;
    margin: 0px auto;
    padding: 0px 0px 10px 0px;
    gap: 13px;
    grid-template-columns: 1fr 1fr;
}
div.flex_items {
    border: 1px solid rgb(192, 189, 189);
    box-shadow: 0 4px 8px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19);
    padding: 10px;
    border-radius: 6px;
    box-sizing: border-box;
}
div.flex_items p {
    font-size: 16px; 
    font-weight: bolder;
    color: white;
}
div.flex_items h1 {
    font-weight: bold;
    font-size: 22px;
    word-wrap: break-word;
    color: white; 
}
div.flex_items hr {
    color: white;
    font-weight: bolder;
    border: 1px solid white;
} 
div.flex_items small {
    font-size: 12px;
    color: #ffffff99;; 
} 
div.grid2 {
    display: block;
}
.category_link {
    color: rgb(83, 82, 82);
    display: inline-block;
    text-decoration: none;
    margin: 18px 17px 10px 0;
    font-size: 18px;
    font-weight: bold;
}
}
/* MOBILE VIEW */




/*DESKTOP VIEW*/
@media only screen and (min-width: 992px) {
    body {
        margin: 0;
        padding: 0;
        font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
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
        margin:0 0 0 250px;
        height: 100vh;
        padding: 0 15px 90px 15px;
        width: 100%;
        overflow-y: auto;
        width: calc(100% - 250px);
    }
    div.sub_container h1{
        margin: 0px auto 25px auto;
        color: #0E2E45;
        font-size: 35px;
        font-weight: 300;
    }
    div.grid1 {
        width: 100%;
        display: grid;
        grid-column-start: 1;
        grid-column-end: 3;
        box-sizing: border-box;
        margin: 0px auto 20px auto;
        padding: 0px 0px 0px 0px;
        column-gap: 10px;
        grid-template-columns: auto auto auto auto;
    }
    div.flex_items {
        background-color: gray;
        padding: 10px;
        border-radius: 6px;
        box-sizing: border-box;
    }
    div.flex_items p {
        font-size: 17px;
        font-weight: bolder; 
        color: white;
    }
    div.flex_items h1 {
        font-weight: bold;
        font-size: 23px;
        color: white; 
    }
    div.flex_items hr {
        color: white;
        font-weight: bolder;
        border: 1px solid white;
    } 
    div.flex_items small {
        font-size: 12px;
        color: #ffffff99;; 
    } 
    div.grid2 {
        display: grid;
        grid-template-columns: 48% 48%;
        column-gap: 20px;
    }
    .category_link {
        color: rgb(83, 82, 82);
        display: inline-block;
        text-decoration: none;
        margin: 18px 20px 10px 0;
        font-size: 20px;
        font-weight: lighter;
    }
}
/*DESKTOP VIEW*/
</style>
