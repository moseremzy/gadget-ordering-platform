<template>
  <div class="card">
    <div class="card-header">
      <!-- Optionally display a title -->
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <div class="card-body">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, watch, nextTick, toRefs } from "vue";

import Chart from "chart.js/auto";

import { useOrdersStore } from '@/stores/orders';

// Props
const props = defineProps({

  title: String,

});

const { title } = toRefs(props);

const orders_store = useOrdersStore();

const orderStatuses = [
  { status: "Completed", count: 150 }, // 150 orders are "Completed"
  { status: "Pending", count: 80 },    // 80 orders are "Pending"
  { status: "Cancelled", count: 30 }, // 30 orders are "Cancelled"
];
 
const chartCanvas = ref(null);

let chartInstance = null;

// Function to create the Pie chart
function createPieChart() {
  // Destroy any existing chart instance to prevent duplication
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Transform the chart data into labels and data arrays
  const labels = orderStatuses.map((item) => item.status);
  const data = orderStatuses.map((item) => item.count);

  // Create a new Pie chart
  chartInstance = new Chart(chartCanvas.value, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgba(75, 192, 192, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 205, 86, 0.5)",
            "rgba(201, 203, 207, 0.5)",
            "rgba(54, 162, 235, 0.5)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 205, 86, 1)",
            "rgba(201, 203, 207, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}`,
          },
        },
      },
    },
  });
}

// Watch for changes in the orderStatuses and update the chart
watch(
  () => orderStatuses,
  () => {
    nextTick(() => {
      createPieChart();
    });
  },
  { deep: true }
);

// Create the chart when the component is mounted
onMounted(() => {
  createPieChart();
});
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin: 20px 0;
}

canvas {
  width: 100%;
  height: auto;
}
</style>
