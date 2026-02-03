<template>
  <div class="modal-overlay">
    <div class="modal">
      
      <h2>Terms and Conditions for TechByCas</h2>

      <div class="terms-content">
        <p><strong>1. Introduction</strong><br>
        These Terms and Conditions govern the use of our website and the purchase of gadgets and accessories from Tech By Cas Gadget Store.</p>

        <p>By accessing or using our website, you agree to comply with these Terms. If you do not agree, you should not use our services.</p>

        <p><strong>2. Eligibility</strong><br>
        You must be at least 18 years old to make purchases. By placing an order, you confirm that the information you provide is accurate and complete.</p>

        <p><strong>3. Products and Pricing</strong><br>
        We strive to ensure all product descriptions, images, and prices are accurate. Prices are subject to change without prior notice. Product availability may vary, and we reserve the right to discontinue items at any time.</p>

        <p><strong>4. Orders and Payment</strong><br>
        Orders are confirmed once payment is successfully processed. We accept payments via credit/debit cards, PayPal, and bank transfer. Fraudulent transactions will be reported to relevant authorities.</p>

        <p><strong>5. Shipping and Delivery</strong><br>
        Delivery times are estimates and may vary by location and courier. We are not liable for delays caused by third-party logistics providers. Risk of loss passes to the customer upon delivery.</p>

        <p><strong>6. Returns and Refunds</strong><br>
        Returns may be requested within 14 days of delivery if the product is defective or not as described. Refunds are processed after returned items are inspected and approved. Certain items (e.g., opened accessories or hygiene-related products) may not be eligible for return.</p>

        <p><strong>7. Warranty</strong><br>
        Some products may include manufacturer warranties. Warranty claims must be made directly with the manufacturer unless otherwise stated.</p>

        <p><strong>8. User Responsibilities</strong><br>
        You agree not to misuse the website, including attempts to hack, disrupt services, or engage in fraud. You are responsible for maintaining the confidentiality of your account credentials.</p>

        <p><strong>9. Intellectual Property</strong><br>
        All content on this website — including logos, images, text, and product descriptions — is owned by Tech By Cas Gadget Store and protected by copyright laws. Unauthorized use is strictly prohibited.</p>

        <p><strong>10. Limitation of Liability</strong><br>
        We are not liable for indirect, incidental, or consequential damages arising from the use of our website or products. Our liability is limited to the maximum extent permitted by law.</p>

        <p><strong>11. Privacy Policy</strong><br>
        We respect your privacy and handle personal data in accordance with our Privacy Policy. By using our website, you consent to the collection and use of your data as described therein.</p>

        <p><strong>12. Governing Law</strong><br>
        These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the Federal High Court (FHC).</p>

        <p><strong>13. Amendments</strong><br>
        We reserve the right to update or modify these Terms at any time. Continued use of the website after changes indicates acceptance of the revised Terms.</p>
      </div>

      <div class="checkbox-area">
        <label>
          <input type="checkbox" v-model="accepted">
          I have read and agree to the Terms and Conditions
        </label>
      </div>

      <button 
        :disabled="!accepted"
        @click="remove_modal"
        class="accept-btn"
      >
        Continue
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import API from "../api/index";

const props = defineProps({
  showTermsCondition: Boolean
})


const emit = defineEmits(['close'])

const accepted = ref(false)


async function remove_modal () {
  
  try {
    
    await API.mark_terms_conditions()
    
    emit('close')   // tell parent to update state
  
  } catch (error) {
    
    console.log(error)
  
  }

}
</script>

<style scoped>

.modal-overlay{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.75);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
}

.modal{
  width:90%;
  max-width:700px;
  height:80vh;
  background:#fff;
  border-radius:12px;
  padding:24px;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 20;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modal h2 {
  font-size: 18px;
  text-align: center;
}

.terms-content{
  overflow-y:auto;
  margin:15px 0;
  padding-right:10px;
}

.checkbox-area{
  margin-bottom:15px;
}

.accept-btn{
  padding:12px;
  border:none;
  border-radius:8px;
  background:#0d6efd;
  color:white;
  font-weight:bold;
  cursor:pointer;
  transition:0.3s;
}

.accept-btn:disabled{
  background:#aaa;
  cursor:not-allowed;
}

.accept-btn:not(:disabled):hover{
  background:#0b5ed7;
}

/* mobile */
@media(max-width:600px){
  .modal{
    padding:16px;
  }
}

</style>
