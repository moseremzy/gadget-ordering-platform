<template>

 <div>

 <HEADER/> 

 <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

 <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

 <LoadingOverlay/>

 <SEARCHRESULT/>

 <SIDEBAR/>

   <div class = "home_container">
     <h1>My Profile</h1>
     <p>Manage your account and view your orders</p>
 
     <!-- Tabs -->
      <div class="tab-container">
        <button
          class="tab"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          Order History
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'profile' }"
          @click="activeTab = 'profile'"
        >
          Profile
        </button>
      </div>

      <!-- PROFILE -->
      <div v-if="activeTab === 'profile'">   
       <div class="contact-form">
        <h2>Personal Information</h2>
        <p>Update your personal information</p>
        <form @submit.prevent="update_info">
        <div class = "grid">
        <div class="field">
            <label>Full Name <span>*</span></label>
            <input type="text" id = "full_name" v-model = "information.fullname" placeholder="Your full name" />
            <p class="err">{{fullnameError}}</p>
        </div>
        
        <div class="field">
            <label>Phone Number <span>*</span></label>
            <input type="text" id = "phone" v-model = "information.phone" placeholder="070 xxxx xxxx" />
            <p class="err">{{phoneError}}</p>
        </div>

        <div class="field">
            <label>Email Address</label>
            <input type="email" v-model = "information.email" placeholder="name@gmail.com" readonly/>
            <p class="err">{{emailError}}</p>
        </div>


        </div>

        <button type="submit" class="send-btn">
            Update Info
        </button>
        </form>

        <div class = "divider"></div>

        <p>Update Delivery Address</p>
        <form @submit.prevent="update_address">
        <div class = "grid">
        <div class="field">
          <label for="">State *</label>
          <select name="state" id="state" v-model = "information.state">
          <option value="Select State">Select State</option>
          <option value="Abia">Abia</option>
          <option value="Adamawa">Adamawa</option>
          <option value="Akwa Ibom">Akwa Ibom</option>
          <option value="Anambra">Anambra</option>
          <option value="Bauchi">Bauchi</option>
          <option value="Bayelsa">Bayelsa</option>
          <option value="Benue">Benue</option>
          <option value="Borno">Borno</option>
          <option value="Cross River">Cross River</option>
          <option value="Delta">Delta</option>
          <option value="Ebonyi">Ebonyi</option>
          <option value="Edo">Edo</option>
          <option value="Ekiti">Ekiti</option>
          <option value="Enugu">Enugu</option>
          <option value="Gombe">Gombe</option>
          <option value="Imo">Imo</option>
          <option value="Jigawa">Jigawa</option>
          <option value="Kaduna">Kaduna</option>
          <option value="Kano">Kano</option>
          <option value="Katsina">Katsina</option>
          <option value="Kebbi">Kebbi</option>
          <option value="Kogi">Kogi</option>
          <option value="Kwara">Kwara</option>
          <option value="Lagos">Lagos</option>
          <option value="Nasarawa">Nasarawa</option>
          <option value="Niger">Niger</option>
          <option value="Ogun">Ogun</option>
          <option value="Ondo">Ondo</option>
          <option value="Osun">Osun</option>
          <option value="Oyo">Oyo</option>
          <option value="Plateau">Plateau</option>
          <option value="Rivers">Rivers</option>
          <option value="Sokoto">Sokoto</option>
          <option value="Taraba">Taraba</option>
          <option value="Yobe">Yobe</option>
          <option value="Zamfara">Zamfara</option>
          <option value="FCT">FCT</option>
        </select>
        <p class="err">{{stateError}}</p>
        </div>
        
        <div class="field">
            <label>City/Town *</label>
            <input type="text" style = "text-transform: capitalize;" placeholder="e.g Benin" v-model = "information.city"/>
            <p class="err">{{cityError}}</p>
        </div>

        <div class="field">
            <label>Address *</label>
            <input type="text" placeholder="e.g No 001 Odion Street" v-model = "information.address"/>
            <p class="err">{{addressError}}</p>
        </div>
        </div>

        <button type="submit" class="send-btn">
            Update Address
        </button>
        </form>
    </div>


    <!-- password -->
    <div class="contact-form">
        <h2>Settings</h2>
        <p>Update Password</p>
        <form @submit.prevent="update_password">
        <div class = "grid">
        <div class="field">
            <label>Old Password <span>*</span></label>
            <input type="password" id = "password" v-model = "password.old_password" placeholder="Old Password" />
            <p class="err">{{old_passwordError}}</p>
        </div>
        
        <div class="field">
            <label>New Password <span>*</span></label>
            <input type="password" id = "new_password" v-model = "password.new_password" placeholder="New password" />
            <p class="err">{{new_passwordError}}</p>
        </div>
            
        <div class="field">
            <label>Confirm Password <span>*</span></label>
            <input type="password" id = "confirm_password" v-model = "password.confirm_password" placeholder="Confirm Password" />
            <p class="err">{{confirm_passwordError}}</p>
        </div>
        </div>
        <button type="submit" class="send-btn">
            Update Password
        </button>
        </form>
    </div>
    </div> 

    <div class="contact-form" v-else>
        <h2>Order History</h2>
        <p>View all your orders and their status</p> 

    <div class="order-history-container" v-if = "orders.length > 0">

    <!-- ORDER CARD -->
    <div class="order-card" v-for="order in orders" :key = "order.order_id">
        <div class="order-header">
        <div>
        <p class="order-id">Order #{{order.order_id}}</p>
        <p class="order-date">Placed on {{MIDDLEWARES.formatted_date(order.created_at)}}</p>
        <p class="order-date">Delivery on {{order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : '...'}}</p>
        </div>
        <span :class="`status ${order.order_status}`">{{order.order_status}}</span>
        </div>

        <div class="order-products">
        <div class="order-info">
            <p class="name">{{order.payment_method}}</p>
            <p class="qty">Items: {{order.total_items}}</p>
            <p class="qty">Confirmation Pin: {{order.confirmation_pin}}</p>
        </div>
        <p class="amount">{{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(order.total_amount)}}</p>
        </div>
        <router-link :to = "'/account/order-details/'+order.order_id" class = "view-btn">View</router-link>
    </div>
    </div>


    <div class = "no_orders" v-else> <!-- no orders -->
        <font-awesome-icon class="fa-solid fa-box-open" id = "box"  icon="fa-solid fa-box-open"/>
        <h1>No orders yet</h1>
        <p>You haven't placed any orders yet. Start shopping.</p>
        <router-link class = "link" to="/shop?category=all">View Products</router-link>
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
import ITEMSNOTFOUND from "@/components/ItemsNotFound.vue"
import FOOTER from "@/components/Footer.vue";
import LoadingOverlay from "../components/modals/loading_overlay.vue";
import { onMounted, onUnmounted, onUpdated, computed, reactive, toRaw, ref, watch} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import API from "../api/index.js";
import MIDDLEWARES from "../middlewares/middlewares"
import { useInteractiveStore } from '@/stores/interactive'
import { useUserStore } from '@/stores/user' 
import { useOrdersStore } from '@/stores/orders' 

const interactive_store = useInteractiveStore()

const user_store = useUserStore()

const orders_store = useOrdersStore()


let user = computed(() => {

    return user_store.user

})

const orders = computed(() => {

    return orders_store.orders

})

// Create local reactive copies for form binding
const information = reactive({
  fullname: "",
  phone: "",
  email: "",
  state: "Select State",
  city: "",
  address: ""
})

let password = reactive({
  old_password: "",
  new_password: "",
  confirm_password: ""
})


const activeTab = ref('history')
const route = useRoute()
const router = useRouter()
 


// Initialize from store
watch(() => user_store.user, (newUser) => {
  if (newUser) {
    information.fullname = newUser.fullname || ""
    information.phone = newUser.phone || ""
    information.email = newUser.email || ""
    information.state = newUser.state || "Select State"
    information.city = newUser.city || ""
    information.address = newUser.address || ""
  }
}, { immediate: true })


watch( () => user_store.isAuthenticated,

  (isAuthenticated) => { //i dey confirm if user still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_error_alert_box(true)

        setTimeout(() => {

           router.push({ path: "sign-in" })
            
        }, 1000);

    }
  }, 
);



const fullnameError = computed(() => { 
  if (!information.fullname) return "Please fill field"
  if (!/^[ A-Za-z]+$/.test(information.fullname)) return "Fullname can only contain letters"
  return ""
})

const phoneError = computed(() => { 
  if (!information.phone) return "Please fill field"
  if (!/^[0-9]*$/.test(information.phone) || information.phone.length != 11) return "Invalid phone number"
  return ""
})

const emailError = computed(() => { 
  if (!information.email) return "Please fill field"
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(information.email)) return "Invalid email"
  return ""
})  

const stateError = computed(() => { 
  if (information.state == 'Select State') return "Please fill field"
  return ""
})  
 
const cityError = computed(() => { 
  if (!information.city) return "Please fill field"
  return ""
})  

const addressError = computed(() => { 
  if (!information.address) return "Please fill field"
  return ""
})  

const old_passwordError = computed(() => { 
  if (!password.old_password) return "Please fill field"
  return ""
})  

const new_passwordError = computed(() => { 
  if (!password.new_password) return "Please fill field"
  if (password.new_password.length < 7 || password.new_password.length > 15) return "Must be between 7 and 15 characters long"
  return ""
})  

const confirm_passwordError = computed(() => { 
  if (!password.confirm_password) return "Please fill field"
  if (password.confirm_password != password.new_password) return "Must match new password"
  return ""
})  


async function update_info() {

    if (fullnameError.value == "" && phoneError.value == "" && emailError.value == "") {

      interactive_store.toggle_loading_overlay(true)

      try {

       const response = await API.update_user_info({
        fullname: information.fullname,
        email: information.email,
        phone: information.phone
      });

      // ✅ Refresh user data from store
      await user_store.fetch_user()

      interactive_store.backend_message = "Your profile was updated succesfully"
      
      interactive_store.display_success_alert_box()
        
      } catch (error) {

      console.log(error)
        
      }     
        
    }  

    interactive_store.toggle_loading_overlay(false)

}



async function update_address() {

    if (stateError.value == "" && cityError.value == "" && addressError.value == "") {

      interactive_store.toggle_loading_overlay(true)

      try {

       const response = await API.update_address({
        state: information.state,
        city: information.city,
        address: information.address
      });

      // ✅ Refresh user data from store
      await user_store.fetch_user()

      interactive_store.backend_message = "Your delivery address was updated succesfully"
      
      interactive_store.display_success_alert_box()
        
      } catch (error) {

      console.log(error)
        
      }     
        
    }  

    interactive_store.toggle_loading_overlay(false)

}





async function update_password() {

    if (old_passwordError.value == "" && new_passwordError.value == "" && confirm_passwordError.value == "") {

        interactive_store.toggle_loading_overlay(true)

        try {

         const response = await API.update_password(password)

          // ✅ Refresh user data from store
         await user_store.fetch_user()

         interactive_store.backend_message = "Your password was updated succesfully"
      
         interactive_store.display_success_alert_box()
             
        } catch (error) {

          console.log(error)
          
        }

        password.old_password = ""
        
        password.new_password = ""
            
        password.confirm_password = ""
        
    }  

    interactive_store.toggle_loading_overlay(false)

}


</script>

<style scoped>
/* GENERAL STYLES */
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

div.home_container p{
    margin: 5px 0;
    font-size: 16px;
    color: rgb(153, 152, 152);
}

/* Tabs */
.tab-container {
  display: flex;
  padding: 3px;
  width: 100%;
  background: var(--secondary-black);
  border-radius: 12px;
  margin: 40px 0 20px 0;
  border: 1px solid #333;
}
.tab {
  flex: 1;
  padding: 5px 0;
  background: transparent;
  border: none;
  color: #888;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: var(--primary-black);
  color: #fff;
  border: none;
  border-radius: 12px;
}
.tab_info {
  margin-top: 20px;
  color: rgb(145, 144, 144);
  padding: 20px 20px;
  border: 1px solid var(--secondary-white);
  background-color: rgb(20, 20, 20);
  border-radius: 12px;
}
.tab_info h1{
  margin: 0 0 15px 0px;
  font-size: 20px;
  color: var(--primary-white);
}
.tab_info p{
 font-size: 15px;
 line-height: 25px;
}

.contact-form {
  background-color: rgb(20, 20, 20);
  color: #fff;
  border: 1px solid var(--secondary-white);
  margin: 40px auto;
  padding: 27px 20px;
  border-radius: 12px;
}

.contact-form h2 {
  margin-bottom: 4px;
}

.contact-form p {
  color: #aaa;
  font-size: 18px !important;
  margin: 0px 0 10px 0 !important;
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

.divider {
  margin: 20px 0;
  border-bottom: 1px solid var(--secondary-black);
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

.order-history-container {
  padding: 30px;
  color: #fff;
  font-family: "Inter", sans-serif;
}

.title {
  font-size: 1.6rem;
  margin-bottom: 25px;
}

.order-card {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 20px;
  border: 1px solid #222;
}

.order-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
}

.order-id {
  font-size: 14px;
  font-weight: 600;
}

.order-date {
  font-size: 12px;
  color: #aaa;
}

.status {
  padding: 8px 10px;   
  border-radius: 12px;
}

.status.delivered {
  background: rgba(50, 255, 126, 0.15);
  color: #2bff8a;
}

.status.confirmed {
  background: rgba(46, 139, 132, 0.15);
  color: rgb(0, 174, 255);
}


.status.pending {
  background: rgba(255, 215, 0, 0.15);
  color: #d4af37;
}

.status.out-for-delivery {
  background: rgba(255, 165, 0, 0.15);
  color: #ffa500;
}

.status.cancelled {
  background: rgba(255, 0, 55, 0.15);
  color: #ff3244;
}

.status.returned {
  background: rgba(255, 0, 55, 0.15);
  color: #ff3244;
}

.order-products {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-products img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
}

.order-info .name {
  font-size: 14px;
  margin-bottom: 3px;
}

.order-info .qty {
  font-size: 12px;
  color: #ccc;
}

.amount {
  margin-left: auto;
  font-size: 15px;
  font-weight: 700;
  color: #ff4c4c;
}

.view-btn {
  margin-top: 15px;
  width: 100%;
  display: inline-block;
  background: #007bff;
  color: #fff;
  text-align: center;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}


.no_orders {
       margin: 40px 0 0 0;
       text-align: center;
}
#box {
    color: rgb(111, 136, 128);
    font-size: 60px;
}
.no_orders h1 {
    color: var(--primary-white) !important;
    font-size: 20px;
    margin: 10px 0 0 0;
}
.no_orders p {
    color: rgb(128, 119, 119);
    margin-top: 8px;
}
.no_orders .link {
    text-decoration: none;
    color: var(--primary-white);
    padding: 8px 12px;
    margin-top: 8px;
    display: inline-block;
    border: 1px solid var(--primary-blue);
    background-color: var(--primary-blue);
    border-radius: 12px;
}

p.err {
    color: rgb(207, 56, 56) !important;
    font-size: 12px !important;
    font-weight: none !important;
    margin: 9px 0 0 0 !important;
}
 

/* DESKTOP */
@media only screen and (min-width: 800px) {

.grid {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
}

.view-btn {
    width: 200px;
    margin: auto auto;
    display: block;
}

.send-btn {
  width: 150px;
}

}

/* MOBILE */
@media only screen and (max-width: 800px) {

  div.home_container h1{
    font-size: var(--container-mobile-font-size);
  }

  .order-history-container {
    padding: 30px 0px;
  }

  
.contact-form h2 {
  font-size: 20px;
  margin-bottom: 4px;
}

.contact-form p {
  color: #aaa;
  font-size: 16px !important;
  margin: 0px 0 10px 0 !important;
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

}
</style>