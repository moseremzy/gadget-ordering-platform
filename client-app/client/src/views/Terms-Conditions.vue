<template>
  <div>

    <HEADER/> 

    <SUCCESSALERTBOX>{{ interactive_store.backend_message }}</SUCCESSALERTBOX>
    
    <ERRORALERTBOX>{{ interactive_store.backend_message }}</ERRORALERTBOX>
    
    <SUCCESSMODAL>{{ interactive_store.backend_message }}</SUCCESSMODAL>

    <LoadingOverlay/>

    <SEARCHRESULT/>
    
    <SIDEBAR/>
    
    <INFOMODAL>{{ backend_message }}</INFOMODAL>

    <!-- MAIN CONTENT -->
    <div class="home_container">

      <div class="policy_wrapper">

        <header class="policy_header">
          <h1>Terms and Conditions</h1>
          <p>Last updated: January 2026</p>
        </header>

        <section class="policy_content">

          <article>
            <h2>1. Introduction</h2>
            <p>
              These Terms and Conditions govern the use of our website and the purchase
              of gadgets and accessories from <strong>Tech By Cas Gadget Store</strong>.
            </p>
            <p>
              By accessing or using our website, you agree to comply with these Terms.
              If you do not agree, you should not use our services.
            </p>
          </article>

          <article>
            <h2>2. Eligibility</h2>
            <ul>
              <li>You must be at least 18 years old to make purchases.</li>
              <li>
                By placing an order, you confirm that the information you provide is
                accurate and complete.
              </li>
            </ul>
          </article>

          <article>
            <h2>3. Products and Pricing</h2>
            <ul>
              <li>We strive to ensure all product descriptions, images, and prices are accurate.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>
                Product availability may vary, and we reserve the right to discontinue
                items at any time.
              </li>
            </ul>
          </article>

          <article>
            <h2>4. Orders and Payment</h2>
            <ul>
              <li>Orders are confirmed once payment is successfully processed.</li>
              <li>We accept payments via credit/debit cards, PayPal, and bank transfer.</li>
              <li>Fraudulent transactions will be reported to relevant authorities.</li>
            </ul>
          </article>

          <article>
            <h2>5. Shipping and Delivery</h2>
            <ul>
              <li>Delivery times are estimates and may vary by location and courier.</li>
              <li>We are not liable for delays caused by third-party logistics providers.</li>
              <li>Risk of loss passes to the customer upon delivery.</li>
            </ul>
          </article>

          <article>
            <h2>6. Returns and Refunds</h2>
            <ul>
              <li>
                Returns may be requested within 14 days of delivery if the product is
                defective or not as described.
              </li>
              <li>
                Refunds are processed after returned items are inspected and approved.
              </li>
              <li>
                Certain items (e.g., opened accessories or hygiene-related products)
                may not be eligible for return.
              </li>
            </ul>
          </article>

          <article>
            <h2>7. Warranty</h2>
            <p>
              Some products may include manufacturer warranties. Warranty claims must
              be made directly with the manufacturer unless otherwise stated.
            </p>
          </article>

          <article>
            <h2>8. User Responsibilities</h2>
            <ul>
              <li>
                You agree not to misuse the website, including attempts to hack,
                disrupt services, or engage in fraud.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
            </ul>
          </article>

          <article>
            <h2>9. Intellectual Property</h2>
            <p>
              All content on this website — including logos, images, text, and product
              descriptions — is owned by Tech By Cas Gadget Store and protected by
              copyright laws.
            </p>
            <p>Unauthorized use is strictly prohibited.</p>
          </article>

          <article>
            <h2>10. Limitation of Liability</h2>
            <p>
              We are not liable for indirect, incidental, or consequential damages
              arising from the use of our website or products.
            </p>
            <p>
              Our liability is limited to the maximum extent permitted by law.
            </p>
          </article>

          <article>
            <h2>11. Privacy Policy</h2>
            <p>
              We respect your privacy and handle personal data in accordance with our
              <router-link to="/privacy-policy">Privacy Policy</router-link>.
            </p>
            <p>
              By using our website, you consent to the collection and use of your data
              as described therein.
            </p>
          </article>

          <article>
            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria.
            </p>
            <p>
              Any disputes shall be resolved in the Federal High Court (FHC).
            </p>
          </article>

          <article class="contact_box">
            <h2>13. Amendments</h2>
            <p>
              We reserve the right to update or modify these Terms at any time.
            </p>
            <p>
              Continued use of the website after changes indicates acceptance of the
              revised Terms.
            </p>
          </article>

        </section>
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
import LoadingOverlay from "../components/modals/loading_overlay.vue";
import INFOMODAL from "@/components/modals/InfoModal.vue";
import SUCCESSMODAL from "@/components/modals/SuccessModal.vue";
import FOOTER from "@/components/Footer.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import API from "../api/index";
import { useInteractiveStore } from '@/stores/interactive'
import { useSettingStore } from '@/stores/settings'
const interactive_store = useInteractiveStore()
const settings_store = useSettingStore()
 
</script>

<style scoped>
* {
  font-family: var(--font-family);
  box-sizing: border-box;
  padding: 0;
  margin: 0;
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

.policy_wrapper {
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 40px;
  border-radius: 10px;
}

/* Header */
.policy_header {
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.policy_header h1 {
  color: var(--primary-blue);
  margin-bottom: 5px;
}

.policy_header p {
  font-size: 13px;
  color: #777;
}

/* Content */
.policy_content article {
  margin-bottom: 25px;
}

.policy_content h2 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #222;
}

.policy_content p,
.policy_content li {
  font-size: 14px;
  color: #444;
  line-height: 1.7;
}

.policy_content ul {
  margin-left: 20px;
}

/* Contact box */
.contact_box {
  background: #f5f8ff;
  padding: 20px;
  border-left: 4px solid var(--primary-blue);
  border-radius: 6px;
}

.icons {
  margin-right: 5px;
  color: var(--primary-blue);
}

/* Mobile */
@media (max-width: 800px) {
  .policy_wrapper {
    padding: 25px;
  }

  .policy_header h1 {
    font-size: 20px;
  }
}

</style>