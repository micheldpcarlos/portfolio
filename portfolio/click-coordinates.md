---
title: Click Coordinates Test
description: Test page to show click coordinates relative to a button
---

# Click to show the X and Y of the click

<div class="container">
  <div id="coordinates-display" class="coordinates-display">
    Click the button below to see coordinates
  </div>
  
  <button id="test-button" class="test-button" @click="handleButtonClick">
    Click anywhere on this button
  </button>
</div>

<script setup>
import { onMounted } from 'vue'

const handleButtonClick = (event) => {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  
  // Calculate coordinates relative to the button
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Update the display
  const display = document.getElementById('coordinates-display')
  if (display) {
    display.textContent = `X: ${Math.round(x)}px, Y: ${Math.round(y)}px`
    display.className = 'coordinates-display active'
  }
  
  console.log(`Button click at X: ${Math.round(x)}, Y: ${Math.round(y)} (relative to button)`)
}

onMounted(() => {
  console.log('Click coordinates page loaded')
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 20px;
  gap: 30px;
}

.coordinates-display {
  font-size: 24px;
  font-weight: bold;
  color: #495057;
  background: #f8f9fa;
  padding: 15px 25px;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  min-width: 300px;
  text-align: center;
  transition: all 0.3s ease;
}

.coordinates-display.active {
  color: #155724;
  background: #d4edda;
  border-color: #28a745;
  transform: scale(1.05);
}

.test-button {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 0;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 16px rgba(0, 123, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
}

.test-button:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  box-shadow: 0 12px 24px rgba(0, 123, 255, 0.4);
}

.test-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 2.5rem;
}
</style> 