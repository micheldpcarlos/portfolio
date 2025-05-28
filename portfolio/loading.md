---
title: Navigation Test Page
description: Test page for waitForNavigation function - 15 second load
---

# 🧪 Navigation Test Page

<div class="test-container">
  <div id="page-status" class="status loading">
    Page Loading...
  </div>
  
  <div id="network-status" class="status loading">
    Pending Requests: 0
  </div>
  
  <div class="progress-container">
    <div class="progress-bar">
      <div id="progress-fill" class="progress-fill"></div>
    </div>
    <div id="progress-text">0% Complete</div>
  </div>
  
  <div class="button-container">
    <button id="test-button" class="test-button" @click="handleButtonClick">
      Click Me During Loading
    </button>
  </div>
  
  <h2>Loading Resources...</h2>
  <div id="resource-list" class="resource-list">
    <!-- Resources will be added here dynamically -->
  </div>
  
  <h2>Button Click Log</h2>
  <div id="click-log" class="click-log">
    Click the button above to see how many requests are pending...
  </div>
</div>

<script setup>
import { onMounted } from 'vue'

let totalRequests = 0
let completedRequests = 0
let pendingRequests = 0

const updateStatus = () => {
  const pageStatus = document.getElementById('page-status')
  const networkStatus = document.getElementById('network-status')
  const progressFill = document.getElementById('progress-fill')
  const progressText = document.getElementById('progress-text')
  
  if (!pageStatus || !networkStatus) return
  
  const progress = totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0
  
  if (progressFill) {
    progressFill.style.width = `${progress}%`
  }
  
  if (progressText) {
    progressText.textContent = `${Math.round(progress)}% Complete`
  }
  
  if (networkStatus) {
    networkStatus.textContent = `Pending Requests: ${pendingRequests}`
  }
  
  if (document.readyState === 'complete' && pendingRequests === 0) {
    pageStatus.className = 'status complete'
    pageStatus.textContent = '✅ Page Fully Loaded'
    networkStatus.className = 'status complete'
    networkStatus.textContent = '✅ All requests completed'
  } else {
    pageStatus.className = 'status loading'
    pageStatus.textContent = `⏳ Page State: ${document.readyState}`
    networkStatus.className = 'status loading'
  }
}

const addToClickLog = (message) => {
  const clickLog = document.getElementById('click-log')
  if (!clickLog) return
  
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
  const logEntry = document.createElement('div')
  logEntry.className = 'log-entry'
  logEntry.innerHTML = `
    <span class="timestamp">[${timestamp}]</span>
    <span class="message">${message}</span>
  `
  
  // Add to top of log
  if (clickLog.children.length === 0 || clickLog.children[0].textContent.includes('Click the button')) {
    clickLog.innerHTML = ''
  }
  clickLog.insertBefore(logEntry, clickLog.firstChild)
  
  console.log(`[NavigationTest] ${message}`)
}

const handleButtonClick = () => {
  const message = `🖱️ Button clicked when ${pendingRequests} requests loading`
  addToClickLog(message)
}

const addResourceToList = (name, status = 'loading') => {
  const resourceList = document.getElementById('resource-list')
  if (!resourceList) return
  
  const resourceDiv = document.createElement('div')
  resourceDiv.className = `resource-item ${status}`
  resourceDiv.id = `resource-${name}`
  resourceDiv.innerHTML = `
    <span class="resource-name">${name}</span>
    <span class="resource-status">${status === 'loading' ? '⏳ Loading...' : '✅ Complete'}</span>
  `
  resourceList.appendChild(resourceDiv)
}

const updateResourceStatus = (name, status) => {
  const resourceElement = document.getElementById(`resource-${name}`)
  if (resourceElement) {
    resourceElement.className = `resource-item ${status}`
    const statusSpan = resourceElement.querySelector('.resource-status')
    if (statusSpan) {
      statusSpan.textContent = status === 'complete' ? '✅ Complete' : '⏳ Loading...'
    }
  }
}

const makeRequest = (name, delay) => {
  totalRequests++
  pendingRequests++
  
  addResourceToList(name, 'loading')
  updateStatus()
  
  console.log(`[NavigationTest] Starting request: ${name} (${delay}ms delay)`)
  
  setTimeout(() => {
    fetch(`/fake-${name}`, { method: 'HEAD' })
      .then(() => {
        completedRequests++
        pendingRequests--
        updateResourceStatus(name, 'complete')
        updateStatus()
        console.log(`[NavigationTest] ✅ Completed: ${name}`)
      })
      .catch(() => {
        completedRequests++
        pendingRequests--
        updateResourceStatus(name, 'complete')
        updateStatus()
        console.log(`[NavigationTest] ✅ Completed (failed): ${name}`)
      })
  }, delay)
}

onMounted(() => {
  console.log(`[NavigationTest] 📄 Page mounted at ${new Date().toISOString()}`)
  console.log(`[NavigationTest] 📊 Initial readyState: ${document.readyState}`)
  
  // Monitor document ready state changes
  document.addEventListener('readystatechange', () => {
    console.log(`[NavigationTest] 📊 ReadyState changed to: ${document.readyState}`)
    updateStatus()
  })
  
  // Monitor page load events
  window.addEventListener('load', () => {
    console.log(`[NavigationTest] 🎯 Window load event fired at ${new Date().toISOString()}`)
    updateStatus()
  })
  
  // Create a 15-second loading sequence with staggered requests
  const loadingSequence = [
    { name: 'css-framework', delay: 200 },
    { name: 'javascript-core', delay: 500 },
    { name: 'user-data', delay: 1000 },
    { name: 'api-config', delay: 1500 },
    { name: 'images-batch-1', delay: 2000 },
    { name: 'fonts-primary', delay: 2500 },
    { name: 'analytics-script', delay: 3000 },
    { name: 'user-preferences', delay: 4000 },
    { name: 'images-batch-2', delay: 5000 },
    { name: 'third-party-widgets', delay: 6000 },
    { name: 'lazy-components', delay: 7500 },
    { name: 'background-data', delay: 9000 },
    { name: 'images-batch-3', delay: 10500 },
    { name: 'final-validation', delay: 12000 },
    { name: 'cache-warmup', delay: 13500 },
    { name: 'completion-check', delay: 14800 }
  ]
  
  console.log(`[NavigationTest] 🚀 Starting ${loadingSequence.length} requests over 15 seconds`)
  
  // Start all requests according to the sequence
  loadingSequence.forEach(({ name, delay }) => {
    makeRequest(name, delay)
  })
  
  // Final status update after everything should be done
  setTimeout(() => {
    console.log(`[NavigationTest] ⏰ 15-second mark reached at ${new Date().toISOString()}`)
    updateStatus()
  }, 15000)
  
  // Initial status update
  updateStatus()
})
</script>

<style scoped>
.test-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.status {
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  font-weight: bold;
  border: 2px solid;
  text-align: center;
  font-size: 18px;
}

.status.loading {
  background: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.status.complete {
  background: #d4edda;
  color: #155724;
  border-color: #00b894;
}

.progress-container {
  margin: 20px 0;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  width: 0%;
  transition: width 0.3s ease;
}

#progress-text {
  font-weight: bold;
  font-size: 16px;
  color: #495057;
}

.button-container {
  text-align: center;
  margin: 20px 0;
}

.test-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-button:hover {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.test-button:active {
  transform: translateY(0);
}

.resource-list {
  margin: 20px 0;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.resource-item.loading {
  background: #f8f9fa;
  border-left: 4px solid #ffc107;
}

.resource-item.complete {
  background: #f8f9fa;
  border-left: 4px solid #28a745;
}

.resource-name {
  font-weight: bold;
}

.resource-status {
  font-size: 12px;
}

.click-log {
  color: black;
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.4;
}

.log-entry {
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.log-entry:last-child {
  border-bottom: none;
}

.timestamp {
  color: #6c757d;
  font-size: 12px;
}

.message {
  margin-left: 10px;
  color: #495057;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin: 30px 0 20px 0;
}
</style>