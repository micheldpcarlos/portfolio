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
        You typed: <span>{{ inputValue }}</span>
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

/* Button styles */
.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.button {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #e0e0e0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.button:hover {
  background-color: #d0d0d0;
}

.button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* Input styles */
.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
}

.input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Display input text */
.input-display {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #555;
}

.input-display span {
  font-weight: bold;
  color: #333;
}
</style>
