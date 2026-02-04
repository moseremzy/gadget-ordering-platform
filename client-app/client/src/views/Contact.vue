<template>

 <div>

 <HEADER/> 

 <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

 <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

 <TERMSCONDITION
    v-if = "user_store.showTermsConditions" 
    :showTermsCondition = "user_store.showTermsConditions" 
    @close = "user_store.showTermsConditions = false"
  />

 <SUCCESSMODAL>{{interactive_store.backend_message}}</SUCCESSMODAL>

 <LoadingOverlay/>

 <SEARCHRESULT/>

 <SIDEBAR/>

 <INFOMODAL>{{backend_message}}</INFOMODAL>

   <div class = "home_container">

    <h1>Contact Us</h1>

    <div class = "flex_container">

    <div class="contact-info">

    <h2>Get in Touch</h2>

    <div class="info-item">
        <div class="icon"><font-awesome-icon class="fa-solid fa-phone blue" icon="fa-solid fa-phone" /></div>
        <div class="details">
        <h4>Phone Lines</h4>
        <p class="blue">{{settings_store.whatsapp}}</p>
        </div>
    </div>

    <div class="info-item">
        <div class="icon"><font-awesome-icon class="fa-solid fa-envelope blue" icon="fa-solid fa-envelope" /></div>
        <div class="details">
        <h4>Email</h4>
        <p class="blue">support@techbycas.com</p>
        </div>
    </div>

    <div class="info-item">
        <div class="icon"><font-awesome-icon class="fa-solid fa-clock blue" icon="fa-solid fa-clock" /></div>
        <div class="details">
        <h4>Store Hours</h4>
        <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
        <p>Sunday: Closed</p>
        </div>
    </div>
    </div>


    <div class="contact-form">
    <h2>Send us a Message</h2>
    <p>Fill out the form below and we'll get back to you within 24 hours.</p>

    <form @submit.prevent = "submit">
      <div class="row">
        <div class="field">
          <label>Full Name <span>*</span></label>
          <input type="text" id = "full_name" v-model = "formvalues.fullname" placeholder="Your full name" required/>
        </div>
        <div class="field">
          <label>Phone Number <span>*</span></label>
          <input type="text" id = "phone" v-model = "formvalues.phone" placeholder="+234 xxx xxxx xxx" required/>
        </div>
      </div>

      <div class="field">
        <label>Email Address</label>
        <input type="email" placeholder="your.email@example.com" v-model = "formvalues.email" required/>
      </div>

      <div class="field">
        <label>Message <span>*</span></label>
        <textarea
          v-model = "formvalues.message"
          placeholder="Tell us about the gadgets you’re looking for, any questions you have, or how we can help you..."
          required
        ></textarea>
      </div>

      <button type="submit" class="send-btn">
        Send Message
      </button>

      <p class="note">
        * Required fields. We typically respond within 24 hours.
      </p>
    </form>
  </div>
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


let formvalues = reactive({
    fullname: "",
    phone: "",
    email: "",
    message: ""
})


async function submit() {

    interactive_store.toggle_loading_overlay(true)

    try {

      const response = await API.contact_us(formvalues);

      interactive_store.backend_message = response.message
    
      interactive_store.display_success_modal_box(true)

      clear_fields()
      
    } catch (error) {

      console.log(error)
      
    }

    interactive_store.toggle_loading_overlay(false)
     
 }


function clear_fields() {
    formvalues.email = ""
    formvalues.phone = ""
    formvalues.fullname = ""
    formvalues.message = ""
}


</script>

<style scoped>
* {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
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

.contact-info {
  background-color: rgb(20, 20, 20);
  color: #fff;
  height: auto;
  margin: 40px auto;
  border: 1px solid var(--secondary-white);
  padding: 32px;
  border-radius: 12px;
}

.contact-info h2 {
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 22px;
}

.icon {
  margin-right: 14px;
  font-size: 15px;
  margin-top: 3px;
}

.details h4 {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 6px;
}

.details p {
  margin: 2px 0;
  font-size: 15px;
}

.green {
  color: #21d07a;
}

.blue {
  color: var(--primary-blue);
}

.contact-info p:last-child {
  margin-bottom: 0;
}

.contact-form {
  background-color: rgb(20, 20, 20);
  color: #fff;
  border: 1px solid var(--secondary-white);
  margin: 40px auto;
  padding: 40px;
  border-radius: 12px;
}

.contact-form h2 {
  margin-bottom: 4px;
}

.contact-form p {
  color: #aaa;
  margin-bottom: 25px;
}

form .row {
  display: flex;
  gap: 0px;
  flex-wrap: wrap;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

label {
  margin-bottom: 6px;
}

label span {
  color: var(--primary-blue);
}

input,
select,
textarea {
  background: #181818;
  border: 1px solid #333;
  color: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  outline: none;
  transition: 0.3s;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--primary-blue);
}

textarea {
  resize: none;
  min-height: 110px;
}

.send-btn {
  background: var(--primary-blue);
  color: #fff;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: 0.3s;
}

.send-btn:hover {
  background: var(--primary-blue);
}

.note {
  color: #aaa;
  margin-top: 12px;
  text-align: center;
}

/* MOBILE DEVICES */
@media only screen and (max-width: 800px) {
 
  p.err {
      color: red;
      font-size: 12px;
  }
 
  div.home_container h1{
    font-size: var(--container-mobile-font-size);
  }

}



/* DESKTOP */
@media only screen and (min-width: 800px) {
  
  .flex_container {
      display: flex;
      align-items: flex-start;
      justify-content: space-evenly;
  }

   .contact-form, .contact-info {
       margin-left: 10px;
       margin-right: 10px;
   }

  #full_name {
      margin-right: 5px;
  }

  #phone {
      margin-left: 5px;
  }

  p.err {
     color: red;
     font-size: 12px;
  }
}
</style>