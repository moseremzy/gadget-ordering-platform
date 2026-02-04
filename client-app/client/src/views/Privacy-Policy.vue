<template>
  
  <div>

    <HEADER/> 

    <SUCCESSALERTBOX>{{ interactive_store.backend_message }}</SUCCESSALERTBOX>
    
    <ERRORALERTBOX>{{ interactive_store.backend_message }}</ERRORALERTBOX>
    
    <TERMSCONDITION
      v-if = "user_store.showTermsConditions" 
      :showTermsCondition = "user_store.showTermsConditions" 
      @close = "user_store.showTermsConditions = false"
    />

    <SUCCESSMODAL>{{ interactive_store.backend_message }}</SUCCESSMODAL>

    <LoadingOverlay/>
    
    <SEARCHRESULT/>
    
    <SIDEBAR/>
    
    <INFOMODAL>{{ backend_message }}</INFOMODAL>

    <!-- MAIN CONTENT -->
    <div class="home_container">

      <div class="policy_wrapper">

        <header class="policy_header">
          <h1>Privacy Policy</h1>
          <p>Last updated: January {{new Date().getFullYear()}}</p>
        </header>

        <section class="policy_content">

          <article>
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy explains how <strong>Tech By Cas Gadget Store</strong>
              collects, uses, and protects your personal information when you visit
              our website or purchase products.
            </p>
            <p>
              By using our services, you consent to the practices described in this Policy.
            </p>
          </article>

          <article>
            <h2>2. Information We Collect</h2>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping address.</li>
              <li><strong>Payment Information:</strong> Processed securely through third-party payment providers.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on the site, and purchase history.</li>
            </ul>
          </article>

          <article>
            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>Process and deliver orders</li>
              <li>Communicate with you about purchases, promotions, or updates</li>
              <li>Improve website functionality and customer experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </article>

          <article>
            <h2>4. Sharing of Information</h2>
            <p>We do not sell or rent your personal information.</p>
            <p>
              Information may be shared with trusted third parties such as payment
              processors, shipping companies, and IT service providers.
            </p>
            <p>
              Data may also be disclosed where required by law.
            </p>
          </article>

          <article>
            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your browsing experience, remember preferences,
              and analyze site traffic. You can disable cookies in your browser settings,
              but some features may not function properly.
            </p>
          </article>

          <article>
            <h2>6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information.
              However, no method of transmission over the internet is completely secure.
            </p>
          </article>

          <article>
            <h2>7. Your Rights</h2>
            <ul>
              <li>Access, update, or delete your personal data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of the data we hold about you</li>
            </ul>
          </article>

          <article>
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites.
              We are not responsible for their privacy practices.
            </p>
          </article>

          <article>
            <h2>9. Children’s Privacy</h2>
            <p>
              Our services are not directed to individuals under 18.
              We do not knowingly collect personal data from minors.
            </p>
          </article>

          <article>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time.
              Any changes will be posted on this page.
            </p>
          </article>

          <article class="contact_box">
            <h2>11. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy:</p>
            <p><font-awesome-icon class="fa-solid fa-envelope blue icons" icon="fa-solid fa-envelope" /> support@techbycas.com</p>
            <p><font-awesome-icon class="fa-solid fa-phone blue icons" icon="fa-solid fa-phone" />{{settings_store.whatsapp}}</p>
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
import TERMSCONDITION from "../components/TermsConditionModal.vue";
import LoadingOverlay from "../components/modals/loading_overlay.vue";
import INFOMODAL from "@/components/modals/InfoModal.vue";
import SUCCESSMODAL from "@/components/modals/SuccessModal.vue";
import FOOTER from "@/components/Footer.vue";
import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch} from 'vue'
import MIDDLEWARES from "../middlewares/middlewares"
import API from "../api/index";
import { useInteractiveStore } from '@/stores/interactive'
import { useSettingStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
const interactive_store = useInteractiveStore()
const settings_store = useSettingStore()
const user_store = useUserStore()

 
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