---
title: 40-Second Loading Test Page
description: Extended test page for waitForNavigation function - 40 second load
---

# 🕐 40-Second Loading Test Page

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
  
  // Only complete when ALL requests are done
  if (document.readyState === 'complete' && pendingRequests === 0 && completedRequests === totalRequests) {
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
  
  console.log(`[40sTest] ${message}`)
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

const makeRequest = (name, delay) => {
  totalRequests++
  pendingRequests++
  
  addResourceToList(name, 'loading')
  updateStatus()
  
  console.log(`[40sTest] Starting request: ${name} (${delay}ms delay)`)
  
  setTimeout(() => {
    fetch(`/fake-${name}`, { method: 'HEAD' })
      .then(() => {
        completedRequests++
        pendingRequests--
        updateResourceStatus(name, 'complete')
        updateStatus()
        console.log(`[40sTest] ✅ Completed: ${name}`)
      })
      .catch(() => {
        completedRequests++
        pendingRequests--
        updateResourceStatus(name, 'complete')
        updateStatus()
        console.log(`[40sTest] ✅ Completed (failed): ${name}`)
      })
  }, delay)
}

onMounted(() => {
  // Start the timer
  startTime = Date.now()
  timerInterval = setInterval(updateTimer, 100) // Update every 100ms for smooth display
  
  console.log(`[40sTest] 📄 Page mounted at ${new Date().toISOString()}`)
  console.log(`[40sTest] 📊 Initial readyState: ${document.readyState}`)
  
  // Monitor document ready state changes
  document.addEventListener('readystatechange', () => {
    console.log(`[40sTest] 📊 ReadyState changed to: ${document.readyState}`)
    updateStatus()
  })
  
  // Monitor page load events
  window.addEventListener('load', () => {
    console.log(`[40sTest] 🎯 Window load event fired at ${new Date().toISOString()}`)
    updateStatus()
  })
  
  // Create 40-second loading sequence with many requests spread over time
  const loadingSequence = [
    // Phase 1: Core assets (0-5s)
    { name: 'html-parser', delay: 200 },
    { name: 'css-framework', delay: 800 },
    { name: 'javascript-core', delay: 1500 },
    { name: 'dom-ready', delay: 2200 },
    { name: 'initial-styles', delay: 3000 },
    { name: 'base-fonts', delay: 3800 },
    { name: 'layout-engine', delay: 4500 },
    
    // Phase 2: User data and API (5-10s)
    { name: 'user-session', delay: 5200 },
    { name: 'api-config', delay: 6000 },
    { name: 'user-preferences', delay: 6800 },
    { name: 'auth-tokens', delay: 7500 },
    { name: 'user-profile', delay: 8200 },
    { name: 'permissions', delay: 9000 },
    { name: 'feature-flags', delay: 9800 },
    
    // Phase 3: Content and media (10-20s)
    { name: 'content-api', delay: 10500 },
    { name: 'images-batch-1', delay: 11200 },
    { name: 'video-metadata', delay: 12000 },
    { name: 'media-processor', delay: 12800 },
    { name: 'images-batch-2', delay: 13500 },
    { name: 'thumbnails', delay: 14200 },
    { name: 'content-cache', delay: 15000 },
    { name: 'search-index', delay: 15800 },
    { name: 'images-batch-3', delay: 16500 },
    { name: 'cdn-assets', delay: 17200 },
    { name: 'static-resources', delay: 18000 },
    { name: 'font-variants', delay: 18800 },
    { name: 'icon-sprites', delay: 19500 },
    
    // Phase 4: Third-party and analytics (20-30s)
    { name: 'analytics-core', delay: 20200 },
    { name: 'tracking-pixels', delay: 21000 },
    { name: 'social-widgets', delay: 21800 },
    { name: 'chat-service', delay: 22500 },
    { name: 'help-system', delay: 23200 },
    { name: 'feedback-api', delay: 24000 },
    { name: 'notification-service', delay: 24800 },
    { name: 'real-time-updates', delay: 25500 },
    { name: 'websocket-connection', delay: 26200 },
    { name: 'push-notifications', delay: 27000 },
    { name: 'background-sync', delay: 27800 },
    { name: 'offline-cache', delay: 28500 },
    { name: 'service-worker', delay: 29200 },
    
    // Phase 5: Advanced features and optimization (30-40s)
    { name: 'lazy-components', delay: 30000 },
    { name: 'code-splitting', delay: 30800 },
    { name: 'dynamic-imports', delay: 31500 },
    { name: 'performance-monitor', delay: 32200 },
    { name: 'error-tracking', delay: 33000 },
    { name: 'a-b-testing', delay: 33800 },
    { name: 'personalization', delay: 34500 },
    { name: 'recommendation-engine', delay: 35200 },
    { name: 'machine-learning', delay: 36000 },
    { name: 'predictive-cache', delay: 36800 },
    { name: 'advanced-analytics', delay: 37500 },
    { name: 'final-optimization', delay: 38200 },
    { name: 'completion-validation', delay: 39000 },
    { name: 'ready-state-check', delay: 39800 }
  ]
  
  console.log(`[40sTest] 🚀 Starting ${loadingSequence.length} requests over 40 seconds`)
  
  // Start all requests according to the sequence
  loadingSequence.forEach(({ name, delay }) => {
    makeRequest(name, delay)
  })
  
  // Final status update after everything should be done
  setTimeout(() => {
    console.log(`[40sTest] ✅ 40-second mark reached - all requests should be complete`)
    updateStatus()
  }, 41000)
  
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
  background: linear-gradient(90deg, #dc3545, #c82333);
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
  background: #dc3545;
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
  background: #c82333;
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
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 10px;
  background: #f8f9fa;
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
  background: #fff;
  border-left: 3px solid #dc3545;
}

.resource-item.complete {
  background: #fff;
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