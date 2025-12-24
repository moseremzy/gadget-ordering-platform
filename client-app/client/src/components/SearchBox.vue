<template>
 
  <div>

  <font-awesome-icon class="fa-solid fa-search" id = "search_icon" icon="fa-solid fa-search"/>

  <input type="text" v-model = "search_data" placeholder = "Search gadgets..." name = "search_box" id = "search_box">

  <font-awesome-icon class="fa-solid fa-xmark" @click = "clearSearch" id = "xmark" icon="fa-solid fa-xmark"/>      

  </div>

</template>

<script setup>

import { useInteractiveStore } from '@/stores/interactive'

import { ref, watch } from 'vue'

const interactive_store = useInteractiveStore()

let search_data = ref("");


watch (search_data, (newValue) => {

     interactive_store.setQuery(newValue)

})


//clear search
function clearSearch() {

    interactive_store.clearQuery();

    search_data.value = ""
    
}


</script>

<style scoped>
/* MOBILE DEVICES */
@media only screen and (max-width: 765px) {

    * {
        margin: 0;
        padding: 0;
        font-family: 'Nuosu SIL';
    }

    div {
        width: 90%;
        position: relative;
        margin: 13px auto 0px auto;
        font-size: 18px;
    }

    div #search_icon {
        position: absolute;
        top: 13px;
        left: 20px;
        color: var(--secondary-white);
    }

    div #xmark {
    position: absolute;
    top: 13px;
    cursor: pointer;
    right: 20px;
    color: var(--secondary-white);
   }

    div #search_box {
        border: 0;
        font-size: 16px;
        display: block;
        width: 100%;
        color: white;
        padding: 10px 0px 10px 60px;
        box-sizing: border-box;
        border-radius: 12px;
        background-color: rgb(43, 42, 42);
    }

    div #search_box:active {
        background-color: var(--primary-black);
        outline: 1px solid var(--primary-blue);
    }

    div #search_box:focus {
        outline: 1px solid var(--primary-blue);
        background-color: var(--primary-black);
    }

}


/* DESKTOP DEVICES */
@media only screen and (min-width: 765px) {
   * {
        margin: 0;
        padding: 0;
        font-family: 'Nuosu SIL';
    }

    div {
        width: 70%;
        position: relative;
        margin: 13px auto 18px auto;
        font-size: 18px;
    }

    div #search_icon {
        position: absolute;
        top: 13px;
        left: 20px;
        color: var(--secondary-white);
    }

    div #xmark {
        position: absolute;
        top: 13px;
        cursor: pointer;
        right: 20px;
        color: var(--secondary-white);
   }

    div #search_box {
        border: 0;
        font-size: 16px;
        display: block;
        width: 100%;
        color: white;
        padding: 10px 0px 10px 60px;
        box-sizing: border-box;
        border-radius: 12px;
        background-color: rgb(43, 42, 42);
    }

    div #search_box:active {
        background-color: var(--primary-black);
        outline: 1px solid var(--primary-blue);
    }

    div #search_box:focus {
        outline: 1px solid var(--primary-blue);
        background-color: var(--primary-black);
    }

}
</style>