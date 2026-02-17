<template>

<div class="container" :style = "interactive_store.container_css">

    <OVERLAY/>

    <SUCCESSALERTBOX>{{interactive_store.backend_message}}</SUCCESSALERTBOX>

    <ERRORALERTBOX>{{interactive_store.backend_message}}</ERRORALERTBOX>

    <SIDEBAR/> <!--side bar--> 

    <div class="sub_container" :style = "interactive_store.sub_container_css">

    <HEADER page_name = "add-item" searchbox_placeholder = "Enter Item Name To Search" /> <!-- Header -->

    <h1>Add Item</h1>

    <div class="add-item-form-container">
    <h2 class="form-title"><slot name="form-title"></slot></h2>
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
        <select id="item-condition" v-model = "item_info.condition" class="form-input" required>
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
          <input type = "number" id="item-quantity" min="1" placeholder="Stock Quantity" v-model = "item_info.quantity" class="form-input" required>        
        <p class="err">{{item_info_error.quantity_err}}</p>
      </div>

      <!-- Item Description -->
      <div class="form-group grid-full">
        <label for="item-description" class="form-label">Item Description</label>
        <textarea id="item-description" v-model = "item_info.description" class="form-input" placeholder="Enter item description" rows="4" required></textarea>
        <p class="err">{{item_info_error.description_err}}</p>
        <p class="err" style="color: gray;" ref = "description_counter">{{item_info.description.length}}/400 characters</p>
      </div>

      <!-- Item Image Upload -->
      <div class="form-group grid-full">
        <label for="item-image" class="form-label">Upload Item Image</label>
        <input type="file" id="item-image" class="form-input" ref="itemImage" accept="image/*" required />
        <p class="err">{{item_info_error.image_err}}</p>
      </div>

      <!-- Item Video Upload -->
      <div class="form-group grid-full">
        <label for="item-video" class="form-label">Upload Item Video (optional)</label>
        <input type="file" id="item-video" class="form-input" ref="itemVideo" accept="video/*" />
        <p class="err">{{item_info_error.video_err}}</p>
      </div>

      <!-- Submit Button -->
      <div class="form-group grid-full">
        <button type="submit" @click.prevent = "UploadItem" class="submit-button">Submit</button>
      </div>
    </form>
  </div>
  </div> <!-- SUB_CONTAINER -->
</div> <!-- CONTAINER --> 
</template>

<script setup>

import { onMounted, onUnmounted, onUpdated, reactive, toRaw, ref, watch, computed} from 'vue'

import { useInteractiveStore } from '@/stores/interactive'

import { useProductStore } from '@/stores/products'

import { useCategoriesStore } from '@/stores/categories'

import HEADER from '../components/Header.vue'; 

import OVERLAY from '../components/modals/loading_overlay.vue';

import SIDEBAR from '../components/SideBar.vue';

import MIDDLEWARES from "@/middlewares/middlewares.js"

import API from "../api/index";

const interactive_store = useInteractiveStore()

const products_store = useProductStore();

const categories_store = useCategoriesStore()


let description_counter = ref(null)

let itemImage = ref(null)

let itemVideo = ref(null);

let item_info = reactive({
    name: "",
    price: "",
    description: "",
    category_id: "",
    condition: "",
    quantity: 1
})

let item_info_error = reactive({
    name_err: "",
    price_err: "",
    description_err: "",
    category_err: "",
    condition_err: "",
    quantity_err: "",
    image_err: "",
    video_err: ""   // 👈 add this
});



const categories = computed(() => {

  return categories_store.categories

})


onUpdated(() => {
    namevalidated()
    pricevalidated()
    descriptionvalidated()
    categoryvalidated()
    conditionvalidated()
    quantityvalidated()
})



function namevalidated() {
  let pattern = /^[A-Za-z0-9\s]+$/;
    if (item_info.name === "") {
        item_info_error.name_err = "Please fill the field";
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
    
    if (item_info.condition === "" || item_info.condition == "Select Condition") {
    
        item_info_error.condition_err = "Please fill field";
    
    } else {
    
        item_info_error.condition_err = ""
        
        return true;        
   }

}



function quantityvalidated() {
    
    if (item_info.quantity === "") {
    
      item_info_error.quantity_err = "Please fill field";
    
    } else if (item_info.quantity == 0) {

      item_info_error.quantity_err = "Stock Quantity Cannot be less than 1";
      
    } else {
    
        item_info_error.quantity_err = ""
        
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


function item_exists() {

 return products_store.products.find((item) => {

      return item.name === item_info.name.toLowerCase()

  })
  
}


async function UploadItem(e) {
    if (namevalidated() && pricevalidated() && categoryvalidated() && descriptionvalidated() && conditionvalidated() && quantityvalidated()) {
        if (item_exists()) {
            interactive_store.backend_message = "Item already exists";
            interactive_store.display_error_alert_box();
            return;
        }

        /* Image Validation */
        const fileInput = itemImage.value; //check if file was selected
        
        let imageFile = fileInput.files[0];

        if (!imageFile) {
            interactive_store.backend_message = "Please upload an image";
            interactive_store.display_error_alert_box();
            return;
        } 

        // Ensures only images are uploaded
        if (imageFile.type != "image/png" && imageFile.type != "image/jpeg" && imageFile.type != "image/jpg") {
            interactive_store.backend_message = "Invalid file";
            interactive_store.display_error_alert_box();
            return
        }

        
        // allow slightly larger originals 5mb
        if (imageFile.size > 5 * 1024 * 1024) {
          interactive_store.backend_message = "Image too large";
          interactive_store.display_error_alert_box();
          return;
        }

         /* Image Validation */


        /*  Video Validation (its optional) */
  
       // get selected video
        const videoInput = itemVideo.value;
        
        let videoFile = null;

        if (videoInput.files[0]) {

            videoFile = videoInput.files[0];

            // Ensure file is a video
            if (!videoFile.type.startsWith("video/")) {
                interactive_store.backend_message = "Invalid video file";
                interactive_store.display_error_alert_box();
                return;
            }

            // Limit video size (e.g., 30MB)
            if (videoFile.size > 30 * 1024 * 1024) {
                interactive_store.backend_message = "Video too large (max 30MB)";
                interactive_store.display_error_alert_box();
                return;
              }
          }

        /* Video Validation */


        // Prepare FormData
        const formData = new FormData();
        formData.append("name", item_info.name);
        formData.append("price", item_info.price);
        formData.append("description", item_info.description);
        formData.append("product_condition", item_info.condition);
        formData.append("stock_quantity", item_info.quantity);
        formData.append("category_id", item_info.category_id);
        formData.append("image", imageFile, imageFile.name) // 👈 THIS FIXES EVERYTHING);
        if (videoFile) { //only append if admin select am
            formData.append("video", videoFile, videoFile.name);
        }

        interactive_store.toggle_loading_overlay(true);

        try {
            
            const response = await API.upload_items(formData); // Ensure API.upload_items sends FormData properly

                await products_store.fetch_products() //refetch items to update items

                resetForm(); //Clear the form fields

                interactive_store.backend_message = "Item uploaded successfully";

                interactive_store.display_success_alert_box();
            
        } catch (error) {
            
            console.log(error)
        
        } 

       interactive_store.toggle_loading_overlay(false);

   }

}


// Function to reset form fields
function resetForm() {
    item_info.name = "";
    item_info.price = "";
    item_info.description = "";
    item_info.condition = "";
    item_info.category_id = "";
    if (itemImage.value) {
    itemImage.value.value = ""; // ✅ THIS is what clears the file input
    }
    if (itemVideo.value) {
    itemVideo.value.value = ""; // clears video input
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
  box-shadow: 0 4px 6px rgba(145, 138, 138, 0.1);
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
