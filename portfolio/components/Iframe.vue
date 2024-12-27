<script setup>
import { ref, onMounted } from "vue";

// Reactive state for buttons and input
const activeButtonIndex = ref(null); // Track the active button (null means no button is active)
const inputValue = ref(""); // Reactive input value

// Function to toggle button active state
const toggleButton = (index) => {
  activeButtonIndex.value = activeButtonIndex.value === index ? null : index;
};

// Check if a button is active
const isButtonActive = (index) => activeButtonIndex.value === index;

// Get the title from the URL on mount
const title = ref("Default Title");
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  title.value = params.get("title") || "Default Title";
});

function forceRefresh() {
  location.reload(true); // Forces a reload from the server, bypassing the cache
}
</script>

<template>
  <div class="iframe-content">
    <!-- Render the title -->
    <h1 class="iframe-title">{{ title }}</h1>

    <!-- Buttons -->
    <div class="buttons">
      <button
        v-for="buttonIndex in 3"
        :key="buttonIndex"
        :class="['button', { active: isButtonActive(buttonIndex) }]"
        @click="toggleButton(buttonIndex)"
      >
        Button {{ buttonIndex }}
      </button>
    </div>

    <!-- Input -->
    <div class="input-wrapper">
      <input
        v-model="inputValue"
        type="text"
        placeholder="Type something..."
        class="input"
      />
      <p class="input-display">
        <a
          @click="forceRefresh"
          style="color: black; font-weight: 500; cursor: pointer"
          >Refresh</a
        >
        || You typed: <span>{{ inputValue }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Wrapper styles */
.iframe-content {
  width: 100vw;
  height: 100vh;
  font-family: Arial, sans-serif;
  padding: 16px;
  margin: 0;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Title styles */
.iframe-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}
</style>
