<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header"> 
      <h3 class="card-title">{{ title }}</h3>

      <div class="year-control">
        <button @click="decreaseYear">‹</button>
        <span>{{ year }}</span>
        <button @click="increaseYear">›</button>
      </div>
    </div>

    <!-- Chart -->
    <div class="card-body">
      <canvas ref="myChart"></canvas>
    </div>
  </div>
</template>


<script setup>

import { ref, toRefs, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { useOrdersStore } from '@/stores/orders';
import MIDDLEWARES from '../../middlewares/middlewares';

// Define props
const props = defineProps({
  title: String,
});

const { title } = toRefs(props);

const myChart = ref(null);

const orders_store = useOrdersStore();

let year = ref(new Date().getFullYear())

let chartInstance = null;


function increaseYear() {
  year.value++;
}

function decreaseYear() {
  year.value--;
}



// Create chart function
function createChart() {
  chartInstance = new Chart(myChart.value, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: `${title.value}`,
          data: title.value === "Revenue" ? [
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jan', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Feb', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Mar', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Apr', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'May', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jun', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jul', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Aug', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Sep', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Oct', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Nov', year.value),
            MIDDLEWARES.revenue_by_month(orders_store.orders, 'Dec', year.value),
          ] : [
            MIDDLEWARES.order_by_month(orders_store.orders, 'Jan', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Feb', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Mar', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Apr', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'May', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Jun', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Jul', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Aug', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Sep', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Oct', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Nov', year.value),
            MIDDLEWARES.order_by_month(orders_store.orders, 'Dec', year.value),
          ],
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Function to update the chart's data
function updateChart() {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = title.value === "Revenue" ? [
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jan', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Feb', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Mar', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Apr', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'May', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jun', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Jul', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Aug', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Sep', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Oct', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Nov', year.value),
      MIDDLEWARES.revenue_by_month(orders_store.orders, 'Dec', year.value),
    ] : [
      MIDDLEWARES.order_by_month(orders_store.orders, 'Jan', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Feb', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Mar', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Apr', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'May', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Jun', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Jul', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Aug', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Sep', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Oct', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Nov', year.value),
      MIDDLEWARES.order_by_month(orders_store.orders, 'Dec', year.value),
    ];

    chartInstance.update();  // Update the chart to reflect new data

  }
}

 
onMounted(() => {

  createChart();  // Create the chart instance when the component is mounted

});

 
watch(
  () => orders_store.orders,
  () => {
    nextTick(() => {
      updateChart();  // Update the chart after the orders data changes
    });
  },
  { deep: true }
);



watch(
  () => year.value,
  () => {
    nextTick(() => {
      updateChart();  // Update the chart after the orders data changes
    });
  },
  { deep: true }
);

</script>

<style scoped>

.card {
  background: #2c2b2b;
  border: 1px solid #1f1f1f;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

/* Year Controls */
.year-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 6px 10px;
}

.year-control span {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  min-width: 50px;
  text-align: center;
}

.year-control button {
  background: none;
  border: none;
  color: #bbb;
  font-size: 18px;
  cursor: pointer;
  padding: 0 6px;
  transition: color 0.2s ease;
}

.year-control button:hover {
  color: #fff;
}

/* Chart container */
.card-body {
  height: 300px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

</style>
