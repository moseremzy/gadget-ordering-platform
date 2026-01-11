<template>

<div class="container" :style = "interactive_store.container_css">

    <OVERLAY/>

    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

   <SIDEBAR/> <!--side bar--> 

    <div class="sub_container" :style = "interactive_store.sub_container_css">

    <HEADER page_name = "edit-item"/> <!--header--> 

    <h1>Edit {{item_info.name}}</h1>

    <div class="add-item-form-container">
    <Status class = "left-badge" :product = item_info />
    <Availability class = "right-badge" :product = item_info />
    <!-- <h2 class="form-title"><slot name="form-title"></slot></h2> -->
    <form enctype = "multipart/form-data" method = "post" action = "/update_photo">
    <div class = "profile">
        <!-- <small style="font-size: 11px; color: gray; margin-bottom: 20px; display: block;">Note: images larger than 3mb won't display</small> -->
        <img :src="`${base_url}/images/${item_info.main_image}`" id = "profile_photo">
                <label for = "file"> <font-awesome-icon style = "font-size: 14px;"  class="fa-solid fa-camera" icon="fa-solid fa-camera"/> Change Photo
                <input type = "file" @change = "updatePhoto" id = "file" name = "image" ref = "itemImage" accept="image/*"></label>
        </div>
    </form>
    <form class="add-item-form grid-form">
      <!-- Item Name -->
      <div class="form-group grid-full">
        <label for="item-name" class="form-label">Item Name</label>
        <input type="text" id="item-name" v-model = "item_info.name" class="form-input" placeholder="Enter item name" required />
        <p class="err">{{item_info_error.name_err}}</p>
      </div>

      <!-- Item Price -->
      <div class="form-group">
        <label for="item-price" class="form-label">Item Price</label>
        <input type="number" v-model = "item_info.price" id="item-price" class="form-input" placeholder="Enter item price" required />
        <p class="err">{{item_info_error.price_err}}</p>
      </div>


      <!-- Item Category -->
      <div class="form-group">
        <label for="item-category" class="form-label">Item Category</label>
        <select id="item-category" v-model = "item_info.category_id" class="form-input" required>
          <option value="">Select Category</option>
          <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
            {{ cat.name }}
          </option>
        </select>
        <p class="err">{{item_info_error.category_err}}</p>
      </div>

      <!-- Item Condition -->
      <div class="form-group">
        <label for="item-condition" class="form-label">Item Condition</label>
        <select id="item-condition" v-model = "item_info.product_condition" class="form-input" required>
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="uk_used">Uk Used</option>
          <option value="refurbished">Refurbished</option>
        </select>
        <p class="err">{{item_info_error.condition_err}}</p>
      </div>


      <!-- Item Availability -->
      <div class="form-group">
        <label for="item-quantity" class="form-label">Item Quantity</label>
          <input type = "number" id="item-quantity" min="1" placeholder="Stock Quantity" v-model = "item_info.stock_quantity" class="form-input" required>        
        <p class="err">{{item_info_error.quantity_err}}</p>
      </div>

      <!-- Item Status -->
      <div class="form-group">
        <label for="item-status" class="form-label">Item Status</label>
        <select id="item-status" v-model = "item_info.status" class="form-input" required>
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <p class="err">{{item_info_error.status_err}}</p>
      </div>

      <!-- Item Description -->
      <div class="form-group grid-full">
        <label for="item-description" class="form-label">Item Description</label>
        <textarea id="item-description" v-model = "item_info.description" class="form-input" placeholder="Enter item description" rows="4" required></textarea>
        <p class="err">{{item_info_error.description_err}}</p>
        <p class="err" style="color: gray;" ref = "description_counter">{{item_info.description.length}}/400 characters</p>
      </div>

      <!-- Submit Button -->
      <div class="form-group grid-full">
        <button type="submit" @click.prevent = "UpdateItem" class="submit-button">Submit</button>
      </div>
    </form>
  </div>

 </div> <!-- SUB_CONTAINER -->
</div> <!-- CONTAINER -->
</template>

<script setup>

import { onMounted, onUnmounted, onUpdated, computed, reactive, toRaw, ref, watch} from 'vue'

import { useAdminStore } from '@/stores/admin'

import HEADER from '../components/Header.vue';

import OVERLAY from '../components/modals/loading_overlay.vue';

import SIDEBAR from '../components/SideBar.vue';

import Status from '../components/Status.vue'

import Availability from '../components/Availability.vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useRoute, useRouter } from 'vue-router'

import { useCategoriesStore } from '@/stores/categories'

import { useProductStore } from '@/stores/products'

import MIDDLEWARES from "@/middlewares/middlewares.js"

import API from "../api/index";

const interactive_store = useInteractiveStore()

const admin_store = useAdminStore()

const route = useRoute()
const router = useRouter()

const products_store = useProductStore();

const categories_store = useCategoriesStore()

const base_url = process.env.VUE_APP_API_BASE_URL

let description_counter = ref(null)

let itemImage = ref("")

const item_id = route.params.item_id

let item_info = reactive([])

let item_info_error = reactive({
    name_err: "",
    price_err: "",
    description_err: "",
    category_err: "",
    condition_err: "",
    quantity_err: "",
    status_err: "",
    image_err: ""
})

if (!admin_store.isAuthenticated) { //if user no get session redirect to login

    router.push({ path: "/login" })

}


watch( () => admin_store.isAuthenticated,

  (isAuthenticated) => { //i dey confirm if admin still dey authenticated

    if (!isAuthenticated) {

        interactive_store.backend_message = "session expired"

        interactive_store.display_success_alert_box(true)

        setTimeout(() => {

           router.push({ path: "/login" })
            
        }, 1000);

    }
  }, 
);




const categories = computed(() => {

  return categories_store.categories

})


function getItems(item_id) { 

 item_info = products_store.products.find((product) => { //get individual item

    return product.product_id == item_id;

  })

 
if (!item_info) { //if item nor dey. redirect to page not found

   router.push({name: "dashboard"})
    
}

}

getItems(item_id)


onUpdated(() => {
    namevalidated()
    pricevalidated()
    descriptionvalidated()
    categoryvalidated()
    conditionvalidated()
    quantityvalidated()
    statusvalidated()
})



function namevalidated() {
  let pattern = /^[A-Za-z0-9\s]+$/;
    if (item_info.name === "") {
        item_info_error.name_err = "Please fill the field";
    } else if (!pattern.test(item_info.name)) {
        item_info_error.name_err = "Item name can only contain letters and spaces";
    } else {
        item_info_error.name_err = "";
        return true;        
    }
}



function pricevalidated() {
    
    if (item_info.price === "") {
    
        item_info_error.price_err = "Please fill field";
    
    }  else {
    
        item_info_error.price_err = ""
        
        return true;
        
    }
}

 

function categoryvalidated() {
    
    if (item_info.category_id === "" || item_info.category_id == "Select Category") {
    
        item_info_error.category_err = "Please fill field";
    
    } else {
    
        item_info_error.category_err = ""
        
        return true;        
   }

}



function conditionvalidated() {
    
    if (item_info.product_condition === "" || item_info.product_condition == "Select Condition") {
    
        item_info_error.condition_err = "Please fill field";
    
    } else {
    
        item_info_error.condition_err = ""
        
        return true;        
   }

}



function quantityvalidated() {
    
    if (item_info.stock_quantity === "") {
    
      item_info_error.quantity_err = "Please fill field";
    
    } else {
    
        item_info_error.quantity_err = ""
        
        return true;        
   }

}



function statusvalidated() {
    
    if (item_info.status === "") {
    
      item_info_error.status_err = "Please fill field";
    
    } else {
    
        item_info_error.status_err = ""
        
        return true;        
   }

}




function descriptionvalidated() {

    if (item_info.description.length >= 400) {

       item_info.description = item_info.description.slice(0, 400)
        
       description_counter.value.attributes[2].nodeValue = "color: red;"
    
    } else if (item_info.description == "") {

      item_info_error.description_err = "Please fill field";
      
    } else {
       
       description_counter.value.attributes[2].nodeValue = "color: gray;"

       item_info_error.description_err = "";
    
       return true
    
    }
}

 

async function updatePhoto() {

    // Get the selected file
        const fileInput = itemImage.value; //check if file was selected
        if (!fileInput.files[0]) {
            interactive_store.backend_message = "Please upload an image";
            interactive_store.display_error_alert_box();
            return;
        } 

        // Ensures only images are uploaded
        if (fileInput.files[0].type != "image/png" && fileInput.files[0].type != "image/jpeg" && fileInput.files[0].type != "image/jpg") {
            interactive_store.backend_message = "Invalid file";
            interactive_store.display_error_alert_box();
            return
        }

        
        // allow slightly larger originals 10mb
        if (fileInput.files[0].size > 10 * 1024 * 1024) {
          interactive_store.backend_message = "Image can't be larger 10mb";
          interactive_store.display_error_alert_box();
          return;
        }

        let compressedImage;

        try {

          compressedImage = await MIDDLEWARES.resizeImage(fileInput.files[0]);
        
        } catch {
          
          interactive_store.backend_message = "Image compression failed";
          
          interactive_store.display_error_alert_box();
          
          return;
        
        }

        if (compressedImage.size > 5 * 1024 * 1024) {
          interactive_store.backend_message = "Compressed image still too large";
          interactive_store.display_error_alert_box();
          return;
        }


        const formData = new FormData();
        formData.append("current_image_name", item_info.main_image)
        formData.append("item_id", item_info.product_id)
        formData.append("main_image", compressedImage, fileInput.files[0].name) // 👈 THIS FIXES EVERYTHING);

        interactive_store.toggle_loading_overlay(true);

        try {
            
              const response = await API.update_photo(formData); // Ensure API.upload_items sends FormData properly

              await products_store.fetch_products() //refetch items to update items

              item_info.main_image = response.data.main_image

              interactive_store.backend_message = "Photo Changed Succesfully";

              interactive_store.display_success_alert_box();
            
        } catch (error) {
            
          console.log(error)
        
        }  

        interactive_store.toggle_loading_overlay(false);

    }



async function UpdateItem(e) {
 
    if (namevalidated() && pricevalidated() && categoryvalidated() && descriptionvalidated() && conditionvalidated() && quantityvalidated() && statusvalidated()) {

        interactive_store.toggle_loading_overlay(true);

        try {
            
            const response = await API.update_item({

              ...item_info

            }); 
            
            await products_store.fetch_products() //refetch items to update item

            interactive_store.backend_message = "Item uploaded successfully";

            interactive_store.display_success_alert_box();
            
        } catch (error) {
            
            interactive_store.backend_message = "Error occurred, please try again";
          
            interactive_store.display_error_alert_box();
        
        }
        
        interactive_store.toggle_loading_overlay(false);
    }
}



</script>

<style scoped>
/*DESKTOP VIEW*/
@media only screen and (min-width: 992px) {
    body {
        margin: 0;
        padding: 0;
        font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
        background-color: rgb(225, 230, 231);
    }
    div.container {
        display: flex;
        height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0;
    }
    div.sub_container {
        display: block;
        margin:0 0 0 250px;
        height: 100vh;
        padding: 0 15px 50px 15px;
        width: 100%;
        overflow-y: auto;
        width: calc(100% - 250px);
    }
    div.sub_container h1{
        margin: 0px auto 5px auto;
        color: #0E2E45;
        font-size: 35px;
        font-weight: 300;
    }
}
/* MOBILE VIEW */
@media only screen and (max-width: 992px) {
body {
    margin: 0;
    padding: 0;
    font-family: "Roboto" ,"Helvetica Neue","Helvetica",Arial,sans-serif;
    background-color: rgb(225, 230, 231);
}
div.container {
    display: flex;
    height: auto; 
    width: 100%; 
    margin: 0;
    padding: 0;  
}
div.sub_container {
    display: block;
    margin:0;
    padding: 0 15px 50px 15px;
    width: 100%; /*calc(100% - 250px)*/;
}
div.sub_container h1{
    margin: 0px auto 5px auto;
    color: #0E2E45;
    font-size: 3rem;
    font-weight: 300;
}
}


.add-item-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 6px rgba(145, 138, 138, 0.1);
}

.left-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.right-badge {
  position: absolute;
  top: 5px;
  right: 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

div.profile{
  width: 100%;
  margin: 0 auto 0 auto;
  text-align: center;
}

div.profile label {
  display: inline-block; 
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #17a2b8;
  padding: 5px;
  border: 1px solid rgb(219, 216, 216);
  font-weight: bolder;
  cursor: pointer;
}

img#profile_photo {
  display: block;
  margin: 0 auto 0 auto;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  image-rendering: auto;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  image-rendering: -webkit-optimize-contrast; 
}

input#file {
  display: none;
}

.form-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grid-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* Make certain fields span full width */
.grid-full {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 16px;
  font-weight: bold;
  color: #555;
}

.form-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

textarea.form-input {
  resize: none;
}

.submit-button {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

p.err {
  color: red;
  font-size: 14px;
  margin: 0;
}

/* Mobile fallback */
@media (max-width: 768px) {
  .grid-form {
    grid-template-columns: 1fr;
  }

  .grid-full {
    grid-column: span 1;
  }
}

</style>
