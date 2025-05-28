---
title: Navigation Test Page
description: Test page for waitForNavigation function - 15 second load
---


<div class="test-container">
  <div class="status-grid">
    <div id="page-status" class="status loading">
      Page Loading...
    </div>
    <div id="network-status" class="status loading">Pending: 0</div>
    <div id="timer" class="timer">⏱️ 0.0s</div>
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
    
  <h2>Button Click Log</h2>
  <div id="click-log" class="click-log">
    Click the button above to see how many requests are pending...
  </div>
  
  <h2>Loading Resources...</h2>
  <div id="resource-list" class="resource-list">
    <!-- Resources will be added here dynamically -->
  </div>

</div>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let totalRequests = 0
let completedRequests = 0
let pendingRequests = 0
let startTime = null
let timerInterval = null
let isComplete = false
let initialBatchComplete = false
let additionalBatchStarted = false

const updateTimer = () => {
  if (!startTime || isComplete) return
  
  const elapsed = (Date.now() - startTime) / 1000
  const timerElement = document.getElementById('timer')
  if (timerElement) {
    timerElement.textContent = `⏱️ ${elapsed.toFixed(1)}s`
  }
}

const stopTimer = () => {
  isComplete = true
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  
  const timerElement = document.getElementById('timer')
  if (timerElement) {
    timerElement.className = 'timer complete'
    const finalTime = ((Date.now() - startTime) / 1000).toFixed(1)
    timerElement.textContent = `✅ ${finalTime}s`
  }
}

const getElapsedSeconds = () => {
  if (!startTime) return 0
  return ((Date.now() - startTime) / 1000).toFixed(1)
}

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
    networkStatus.textContent = `Pending: ${pendingRequests}`
  }
  
  // Only complete when ALL 15 requests are done (10 initial + 5 additional)
  if (document.readyState === 'complete' && pendingRequests === 0 && completedRequests === 15) {
    if (!isComplete) {
      stopTimer()
    }
    pageStatus.className = 'status complete'
    pageStatus.textContent = '✅ Complete'
    networkStatus.className = 'status complete'
    networkStatus.textContent = '✅ Done'
  } else {
    pageStatus.className = 'status loading'
    pageStatus.textContent = `⏳ ${document.readyState}`
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
  const elapsedSeconds = getElapsedSeconds()
  const message = `🖱️ Button clicked at ${elapsedSeconds}s when ${pendingRequests} requests loading`
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
    <span class="resource-status">${status === 'loading' ? '⏳' : '✅'}</span>
  `
  resourceList.appendChild(resourceDiv)
}

const updateResourceStatus = (name, status) => {
  const resourceElement = document.getElementById(`resource-${name}`)
  if (resourceElement) {
    resourceElement.className = `resource-item ${status}`
    const statusSpan = resourceElement.querySelector('.resource-status')
    if (statusSpan) {
      statusSpan.textContent = status === 'complete' ? '✅' : '⏳'
    }
  }
}

const checkInitialBatchComplete = () => {
  if (!initialBatchComplete && pendingRequests === 0 && completedRequests === 10) {
    initialBatchComplete = true
    console.log(`[NavigationTest] 🎯 Initial batch complete! Starting 300ms pause...`)
    
    // Wait 300ms then start additional requests
    setTimeout(() => {
      if (!additionalBatchStarted) {
        additionalBatchStarted = true
        console.log(`[NavigationTest] 🔄 Starting additional 5 requests after 300ms pause`)
        startAdditionalRequests()
      }
    }, 300)
  }
}

const startAdditionalRequests = () => {
  const additionalRequests = [
    { name: 'lazy-components', delay: 1000 },      // completes after 1s
    { name: 'background-data', delay: 2000 },      // completes after 2s  
    { name: 'images-batch-3', delay: 3000 },       // completes after 3s
    { name: 'final-validation', delay: 4000 },     // completes after 4s
    { name: 'completion-check', delay: 5000 }      // completes after 5s
  ]
  
  // Start all requests immediately (no setTimeout wrapper)
  additionalRequests.forEach(({ name, delay }) => {
    makeRequest(name, delay)
  })
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
        
        // Check if initial batch is complete
        checkInitialBatchComplete()
      })
      .catch(() => {
        completedRequests++
        pendingRequests--
        updateResourceStatus(name, 'complete')
        updateStatus()
        console.log(`[NavigationTest] ✅ Completed (failed): ${name}`)
        
        // Check if initial batch is complete
        checkInitialBatchComplete()
      })
  }, delay)
}

onMounted(() => {
  // Start the timer
  startTime = Date.now()
  timerInterval = setInterval(updateTimer, 100) // Update every 100ms for smooth display
  
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
  
  // Create initial loading sequence - 10 requests over ~5 seconds
  const initialLoadingSequence = [
    { name: 'css-framework', delay: 200 },
    { name: 'javascript-core', delay: 500 },
    { name: 'user-data', delay: 1000 },
    { name: 'api-config', delay: 1500 },
    { name: 'images-batch-1', delay: 2000 },
    { name: 'fonts-primary', delay: 2500 },
    { name: 'analytics-script', delay: 3000 },
    { name: 'user-preferences', delay: 3500 },
    { name: 'images-batch-2', delay: 4000 },
    { name: 'third-party-widgets', delay: 4500 }
  ]
  
  console.log(`[NavigationTest] 🚀 Starting ${initialLoadingSequence.length} initial requests`)
  console.log(`[NavigationTest] ⏳ Additional 5 requests will start after initial batch completes + 300ms pause`)
  
  // Start initial requests
  initialLoadingSequence.forEach(({ name, delay }) => {
    makeRequest(name, delay)
  })
  
  // Initial status update
  updateStatus()
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.test-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  margin: 10px 0;
}

.status {
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  border: 2px solid;
  text-align: center;
  font-size: 14px;
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

.timer {
  background: #e9ecef;
  color: #495057;
  padding: 12px 16px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid #6c757d;
  text-align: center;
  white-space: nowrap;
  min-width: 100px;
}

.timer.complete {
  background: #d4edda;
  color: #155724;
  border-color: #00b894;
}

.progress-container {
  margin: 15px 0;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 15px;
  background: #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  width: 0%;
  transition: width 0.3s ease;
}

#progress-text {
  font-weight: bold;
  font-size: 14px;
  color: #495057;
}

.button-container {
  text-align: center;
  margin: 15px 0;
}

.test-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
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
  margin: 15px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.resource-item.loading {
  background: #f8f9fa;
  border-left: 3px solid #ffc107;
}

.resource-item.complete {
  background: #f8f9fa;
  border-left: 3px solid #28a745;
}

.resource-name {
  font-weight: bold;
  font-size: 11px;
}

.resource-status {
  font-size: 14px;
}

.click-log {
  color: black;
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  padding: 12px;
  margin: 15px 0;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  max-height: 150px;
  overflow-y: auto;
  line-height: 1.3;
}

.log-entry {
  padding: 3px 0;
  border-bottom: 1px solid #e9ecef;
}

.log-entry:last-child {
  border-bottom: none;
}

.timestamp {
  color: #6c757d;
  font-size: 11px;
}

.message {
  margin-left: 8px;
  color: #495057;
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin: 25px 0 15px 0;
  font-size: 20px;
}
</style>