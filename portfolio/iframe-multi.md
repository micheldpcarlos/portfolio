---
layout: false
---

<script setup>
import Iframe from './components/Iframe.vue';
import {ref, onMounted } from 'vue'


const title = ref("");

const params = new URLSearchParams(window.location.search);
title.value = params.get("title") || "";
  
const iframeTitle = (iframeTitle) => title.value? title.value + " - Inner " + iframeTitle : iframeTitle

</script>

<div class="main-container">
 <div style="width:200px; background:white; padding:16px"> 
  <h1 style="color:black;font-size:20px;font-weight:500">Outside iframe (main frame)</h1>
  <button class="button" style="margin-top:16px">Button</button>
  <input type="text" class="input" style="margin-top:16px" />
 </div>
  <div class="right-half">
    <div class="right-half-section">
      <iframe :src="`https://micheldpcarlos.com/iframe?title=${iframeTitle('Iframe 1')}`" width="100%" height="100%"/>
    </div>
    <div class="right-half-section">
      <iframe :src="`https://micheldpcarlos.com/iframe?title=${iframeTitle('Iframe 2')}`" width="100%" height="100%"/>
    </div>
    <div class="right-half-section">
      <iframe :src="`https://micheldpcarlos.com/iframe?title=${iframeTitle('Iframe 3')}`" width="100%" height="100%"/>
    </div>
  </div>

<!-- If no title we're rendering outside a nested iframe -->
  <div class="left-half" v-if="!title">
    <div class="left-half-section">
      <iframe src="https://micheldpcarlos.com/iframe-multi?title=Iframe 4" width="100%" height="100%"/>
    </div>
    <div class="left-half-section-b">
      <iframe src="https://micheldpcarlos.com/iframe?title=Iframe 5" width="100%" height="100%"/>
    </div>
  </div>

</div>

<style scoped>
/* Main container takes up 100% of the screen */
.main-container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

/* Right half takes 50% of the screen width */
.right-half {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Each section in the right half takes 1/3 of the height */
.right-half-section {
  flex: 1;
  border: 1px solid #ccc; /* Optional for visualization */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

/* Left half takes 50% of the screen width */
.left-half {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Each section in the left half takes 1/2 of the height */
.left-half-section {
  flex: 3;
  border: 1px solid #ccc; /* Optional for visualization */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
}

.left-half-section-b {
  flex: 1;
  border: 1px solid #ccc; /* Optional for visualization */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9e9e9;
}
</style>
