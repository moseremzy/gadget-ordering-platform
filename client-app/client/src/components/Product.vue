<template>
  <div class="product-card">
    <!-- Badge -->
    <router-link :to = "`/view-product/${product.name}_${product.product_id}`" style = "text-decoration: none;"> 
    <Condition class = "left-badge" :product = product />
    <Availability class = "right-badge" :product = product />

    <!-- Product Image -->
    <div class="image-box">
      <img :src="`${product.main_image}`" />
    </div>

    <!-- Product Details -->
    <div class="details">
      <Category :product = product />
      <h3 class="title">{{product.name}}</h3>
      <p class="specs">{{product.description}}</p>
      <p class="price">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(product.price)}}</p>
    </div>
    </router-link>

    <div class="actions">
    <a href="whatsappLink" target="_blank" class="whatsapp-btn">
        <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
    <button class="cart-btn" @click = "AddToCart(product, 1)">
        <font-awesome-icon class="fa-solid fa-cart-shopping icons" icon="fa-solid fa-cart-shopping" />
    </button>
    </div>
    
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, ref} from 'vue'
import Condition from '../components/Condition.vue'
import Availability from '../components/Availability.vue'
import Category from '../components/Category.vue'
import { useProductStore } from '@/stores/products'
const base_url = process.env.VUE_APP_API_BASE_URL

 
const products_store = useProductStore()

const props = defineProps({

  product: Object

})


const { product } = toRefs(props)

function AddToCart(product, quantity) {

  products_store.add_to_cart(product, quantity)

}

</script>

<style scoped>
* {
    font-family: var(--font-family);
}
.product-card {
  background: linear-gradient(145deg, #1a1a1a 60%, #5086eb 100%);
  color: #fff;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  border: 1px solid var(--secondary-white);
  max-width: 350px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
}

/* badges */
.left-badge {
  position: absolute;
  top: 5px;
  left: 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.right-badge {
  position: absolute;
  top: 5px;
  right: 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* Image */
.image-box {
  width: 100%;
  height: 200px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Details */
.details {
  text-transform: capitalize;
  text-align: left;
  padding: 16px;
}

.category {
  color: var(--primary-blue);
  padding: 3px 10px;
  margin: 17px 0;
  border-radius: 999px;
  font-size: 13px;
  width: fit-content;
}
.title {
  font-size: 20px;
  margin: 17px 0;
  color: var(--primary-white);
  font-weight: 700;
}
.specs {
  font-size: 14px;
  margin: 17px 0;
  color: #aaa;
  line-height: 1.4;
}
.price {
  color: var(--primary-blue);
  font-weight: 700;
  font-size: 28px;
  margin: 6px 0;
}

/* Actions */
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px;
}
.whatsapp-btn {
  background: #25d366;
  border: none;
  border-radius: 999px;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  display: flex;
  visibility: hidden;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: background 0.2s;
}
.whatsapp-btn:hover {
  background: #1da851;
}
.cart-btn {
  background: var(--primary-black);
  color: white;
  border: 1px solid var(--secondary-white);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: background 1s;
}
.cart-btn:hover {
  background: var(--primary-blue);
}

/* Responsive */
@media (max-width: 680px) {
  .product-card {
    max-width: 100%;
  }
  .image-box {
    height: 180px;
  }
  .title {
    font-size: 20px;
  }
  .price {
    font-size: 24px;
  }
}
</style>
