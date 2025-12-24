<template>
  <span class="condition">{{product.product_condition}}</span>
</template>

<script setup>
import { computed, reactive, toRefs, ref} from 'vue'

const props = defineProps({

  product: Object

})


const { product } = toRefs(props)
</script>


<style scoped>
.condition {
    text-transform: capitalize;
    display: inline-block;
    padding: 4px 10px;
    color: var(--primary-white);
    background-color: var(--primary-blue);
    border-radius: 15px;
    font-size: 13px;
    margin: 5px 10px 0 0;
    border: 1px solid var(--primary-white);
}

</style>