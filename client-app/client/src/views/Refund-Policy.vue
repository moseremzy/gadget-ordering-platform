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
          <h1>Return & Refund Policy</h1>
          <p>Last updated: January 2026</p>
        </header>

        <section class="policy_content">

          <article>
            <h2>1. Eligibility for Returns</h2>
            <ul>
              <li>Customers may request a return within 7 days of receiving their order.</li>
              <li>Items must be unused and in the same condition as received.</li>
              <li>
                Products must be returned in their original packaging, including all
                accessories, manuals, and tags.
              </li>
              <li>
                Certain items are non-returnable for hygiene or safety reasons, including
                earphones, opened batteries, and screen protectors.
              </li>
            </ul>
          </article>

          <article>
            <h2>2. Return Process</h2>
            <ul>
              <li>
                To initiate a return, customers must contact us via email with their
                order number and reason for return.
              </li>
              <li>
                Once approved, return instructions will be provided.
              </li>
              <li>
                Customers are responsible for return shipping costs unless the item
                received was defective or incorrect.
              </li>
            </ul>
          </article>

          <article>
            <h2>3. Refunds</h2>
            <ul>
              <li>
                Refunds are processed after returned items are inspected and approved.
              </li>
              <li>
                Approved refunds will be issued to the original payment method within
                7 business days.
              </li>
              <li>
                Shipping fees are non-refundable unless the return is due to our error.
              </li>
              <li>
                All refunds are made strictly to the same account used for payment.
              </li>
            </ul>
          </article>

          <article>
            <h2>4. Damaged or Defective Items</h2>
            <p>
              If an item arrives damaged or defective, customers must notify us within
              24 hours of delivery.
            </p>
            <p>
              The issue should be clearly described and supported with pictures or
              videos where possible.
            </p>
            <p>
              We will arrange a return, replacement, or refund at no additional cost.
            </p>
          </article>

          <article>
            <h2>5. Late or Missing Refunds</h2>
            <p>
              If a refund has not been received after the stated processing time, customers
              should first check with their bank or payment provider.
            </p>
            <p>
              If the issue persists, please contact our support team for assistance.
            </p>
          </article>

          <article class="contact_box">
            <h2>6. Policy Updates</h2>
            <p>
              We reserve the right to update or modify this Return & Refund Policy at any time.
            </p>
            <p>
              Any changes will be posted on this page with an updated effective date.
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