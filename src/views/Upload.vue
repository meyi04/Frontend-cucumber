<template>
  <div class="upload-container">
    <!-- Header -->
    <div class="upload-header">
      <h1 class="upload-title">Upload Cucumber Image</h1>
      <p class="upload-subtitle">Upload or capture an image for disease detection analysis</p>
    </div>

    <!-- Model Status Bar -->
    <div v-if="modelStatus" class="model-status-bar">
      <div class="status-item">
        <span class="status-label">Model:</span>
        <span class="status-value" :class="{ 'status-ready': modelStatus.model_loaded }">
          {{ modelStatus.model_loaded ? 'Loaded ✅' : 'Not Loaded ⚠️' }}
        </span>
      </div>
      <div class="status-item" v-if="modelStatus.class_names">
        <span class="status-label">Classes:</span>
        <span class="status-value">{{ modelStatus.class_names.length }} diseases</span>
      </div>
      <div class="status-item">
        <span class="status-label">Backend:</span>
        <span class="status-value status-ready">Running ✅</span>
      </div>
    </div>

    <!-- Backend Connection Warning -->
    <div v-if="!backendConnected" class="backend-warning">
      <svg viewBox="0 0 24 24" fill="none" class="warning-icon">
        <path d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div>
        <h4>Backend Connection Required</h4>
        <p>{{ backendError || 'Cannot connect to backend server' }}</p>
        <div class="backend-instructions">
          <p><strong>To start the backend:</strong></p>
          <ol>
            <li>Open a terminal/command prompt</li>
            <li>Navigate to: <code>C:\cudics\backend</code></li>
            <li>Run: <code>python app.py</code></li>
          </ol>
          <p class="mt-2"><em>You can still process images locally without backend using mock data.</em></p>
        </div>
      </div>
    </div>

    <!-- Main Upload Area -->
    <div class="upload-main">
      <!-- Left Panel - Upload Options -->
      <div class="upload-options">
        <div class="upload-tabs">
          <button 
            class="tab-btn" 
            :class="{ 'active': activeTab === 'upload' }"
            @click="activeTab = 'upload'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 16V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Upload File
          </button>
          <button 
            class="tab-btn" 
            :class="{ 'active': activeTab === 'camera' }"
            @click="activeTab = 'camera'; initializeCamera()"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" fill="none">
              <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Use Camera
          </button>
        </div>

        <!-- Upload File Tab -->
        <div v-if="activeTab === 'upload'" class="upload-file-area">
          <div 
            class="drop-zone"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleDrop"
            :class="{ 'drag-over': isDragOver }"
            @click="triggerFileInput"
          >
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*"
              class="hidden-input"
            />
            <div class="drop-content">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h3 class="drop-title">Drop image here</h3>
              <p class="drop-subtitle">or click to browse</p>
              <p class="drop-info">Supports: JPG, PNG, JPEG (Max 10MB)</p>
            </div>
          </div>

          <!-- Selected File Preview -->
          <div v-if="selectedFile" class="file-preview">
            <div class="preview-header">
              <div class="file-info">
                <svg class="file-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13 2V9H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div>
                  <p class="file-name">{{ selectedFile.name }}</p>
                  <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>
              <button @click="removeFile" class="remove-btn">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="image-preview">
              <img :src="imagePreview" alt="Preview" class="preview-image" />
            </div>
          </div>
        </div>

        <!-- Camera Tab -->
        <div v-if="activeTab === 'camera'" class="camera-area">
          <div class="camera-container">
            <!-- Camera Preview -->
            <div v-if="!capturedImage" class="camera-preview">
              <video
                ref="videoElement"
                autoplay
                playsinline
                class="camera-video"
                :class="{ 'flipped': isCameraFlipped }"
              ></video>
              <div class="camera-overlay">
                <div class="crop-guide"></div>
              </div>
            </div>

            <!-- Captured Image Preview -->
            <div v-else class="captured-preview">
              <img :src="capturedImage" alt="Captured" class="captured-image" />
            </div>

            <!-- Camera Controls -->
            <div class="camera-controls">
              <button 
                v-if="!capturedImage"
                @click="captureImage"
                class="capture-btn"
                :disabled="!isCameraReady"
              >
                <div class="capture-circle"></div>
              </button>

              <div v-else class="capture-actions">
                <button @click="retakePhoto" class="action-btn retake">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 20V14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 14 3.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.51 15C4.0172 16.4332 4.87907 17.7146 6.01547 18.7246C7.15186 19.7346 8.52549 20.4402 10 20.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Retake
                </button>
                <button @click="useCapturedImage" class="action-btn use">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Use Photo
                </button>
              </div>

              <button 
                v-if="!capturedImage && isCameraReady"
                @click="toggleCamera"
                class="camera-toggle"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 2V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 20V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="camera-instructions">
            <p>📸 Position the cucumber leaf in the center frame for best results</p>
          </div>
        </div>

        <!-- Processing Button -->
        <div class="processing-section">
          <button 
            @click="processImage"
            :disabled="!canProcess || isProcessing"
            class="process-btn"
            :class="{ 'loading': isProcessing }"
          >
            <span v-if="!isProcessing">
              <svg class="process-icon" viewBox="0 0 24 24" fill="none">
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Scan Disease
            </span>
            <span v-else>Processing...</span>
          </button>
          <button
            @click="scanForPest"
            :disabled="!canProcess || isPestScanning"
            class="pest-btn"
            :class="{ 'loading': isPestScanning }"
          >
            <span v-if="!isPestScanning">🪲 Scan for Pest</span>
            <span v-else>Scanning...</span>
          </button>
          <p v-if="!canProcess" class="process-hint">Select an image to begin processing</p>
          <p v-if="canProcess && !backendConnected" class="process-warning">
            ⚠️ Backend not connected. Using mock data for disease detection only.
          </p>
        </div>
      </div>

      <!-- Right Panel - Processing Results -->
      <div class="results-panel">
        <div class="results-header">
          <h3>Analysis Results</h3>
          <p v-if="!hasResults">Upload an image to see analysis results</p>
        </div>

        <!-- Loading State -->
        <div v-if="isProcessing" class="loading-results">
          <div class="loading-spinner"></div>
          <p>Analyzing image for diseases...</p>
          <p class="loading-sub">This may take a few seconds</p>
        </div>

        <!-- Error Message -->
        <div v-if="processingError" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" class="error-icon">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <h4>Processing Error</h4>
            <p>{{ processingError }}</p>
            <button @click="tryMockData" class="mock-data-btn">
              Try with sample data instead
            </button>
          </div>
        </div>

        <div v-if="pestScanResult || pestScanError" class="pest-result-card">
          <div v-if="pestScanResult" class="pest-result-header">
            <div>
              <h4>🪲 Pest Scan Result</h4>
              <p class="pest-subtitle">Detected pest and treatment guidance</p>
            </div>
            <span class="pest-badge">{{ pestScanResult.pest }}</span>
          </div>
          <div v-if="pestScanResult" class="pest-details">
            <p class="pest-confidence">Confidence: {{ pestScanResult.confidence }}%</p>
            <div class="pest-section">
              <h5>Detected Pest</h5>
              <p>{{ pestScanResult.pest }}</p>
            </div>
            <div v-if="pestScanResult.recommendations && pestScanResult.recommendations.length > 0" class="pest-section">
              <h5>Recommended Cure</h5>
              <ul>
                <li v-for="(rec, index) in pestScanResult.recommendations" :key="index">{{ rec }}</li>
              </ul>
            </div>
            <p class="pest-note">{{ pestScanResult.note }}</p>
          </div>
          <p v-if="pestScanError" class="pest-note">{{ pestScanError }}</p>
        </div>

        <!-- Results Display -->
        <div v-if="hasResults && !isProcessing && !processingError" class="results-display">
          <div class="result-card">
            <div class="result-header">
              <div class="result-status" :class="analysisResult.status">
                <span>{{ analysisResult.status === 'healthy' ? '🌿 Healthy' : '⚠️ Infected' }}</span>
              </div>
              <div class="confidence-level">
                <div class="confidence-bar">
                  <div 
                    class="confidence-fill" 
                    :style="{ width: analysisResult.confidence + '%' }"
                  ></div>
                </div>
                <span class="confidence-text">{{ analysisResult.confidence }}% confidence</span>
              </div>
            </div>

            <!-- Disease Probability Chart -->
            <div v-if="analysisResult.all_predictions && Object.keys(analysisResult.all_predictions).length > 0" 
                 class="probability-chart">
              <h4>Disease Probabilities</h4>
              <div class="probability-bars">
                <div v-for="(prob, disease) in analysisResult.all_predictions" 
                     :key="disease" 
                     class="probability-item">
                  <div class="prob-label">{{ formatDiseaseName(disease) }}</div>
                  <div class="prob-bar-container">
                    <div class="prob-bar" :style="{ width: (prob * 100) + '%' }"></div>
                    <span class="prob-percentage">{{ Math.round(prob * 100) }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="disease-info">
              <h4>Detected Disease</h4>
              <p class="disease-name">{{ analysisResult.disease || 'None detected' }}</p>
              
              <div v-if="analysisResult.symptoms && analysisResult.symptoms.length > 0" class="symptoms-list">
                <h5>Symptoms Identified:</h5>
                <ul>
                  <li v-for="(symptom, index) in analysisResult.symptoms" :key="index">
                    {{ symptom }}
                  </li>
                </ul>
              </div>
            </div>

           <div class="recommendations" v-if="analysisResult.recommendations && analysisResult.recommendations.length > 0">
  <h4>Recommendations for {{ analysisResult.disease }}</h4>
  <div class="recommendation-item" v-for="(rec, index) in analysisResult.recommendations" :key="index">
    <svg class="rec-icon" viewBox="0 0 24 24" fill="none">
      <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    <span>{{ rec }}</span>
  </div>
</div>
            <div class="result-meta">
              <p><strong>Processed:</strong> {{ formatTime(analysisResult.timestamp) }}</p>
              <p v-if="!analysisResult.fromBackend" class="mock-note">
                <em>Note: Results based on sample data. Start backend for real analysis.</em>
              </p>
            </div>

            <div class="result-actions">
              <button @click="saveReport" class="save-btn">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 3V8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Save Report
              </button>
              <button class="history-btn" @click="viewHistory">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Uploads -->
    <div v-if="recentUploads.length > 0" class="recent-uploads">
      <h3>Recent Analyses</h3>
      <div class="uploads-grid">
        <div v-for="upload in recentUploads" :key="upload.id" class="upload-item">
          <img :src="upload.image" :alt="upload.name" class="upload-thumbnail" />
          <div class="upload-details">
            <p class="upload-name">{{ upload.name }}</p>
            <p class="upload-date">{{ upload.date }}</p>
            <span class="upload-status" :class="upload.status">{{ upload.status }}</span>
            <p class="upload-disease">{{ upload.disease }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  auth, 
  db,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp
} from '../firebase.js'

const router = useRouter()

// State
const activeTab = ref('upload')
const isDragOver = ref(false)
const selectedFile = ref(null)
const imagePreview = ref('')
const isCameraReady = ref(false)
const isCameraFlipped = ref(false)
const capturedImage = ref('')
const isProcessing = ref(false)
const hasResults = ref(false)
const pestScanResult = ref(null)
const isPestScanning = ref(false)
const pestScanError = ref(null)
const modelStatus = ref(null)
const processingError = ref(null)
const backendError = ref(null)
const backendConnected = ref(false)
const loadingUploads = ref(false) 

// Refs
const fileInput = ref(null)
const videoElement = ref(null)

// Analysis result
const analysisResult = ref({
  status: '',
  confidence: 0,
  disease: '',
  symptoms: [],
  recommendations: [],
  all_predictions: {},
  timestamp: null,
  fromBackend: false
})

// Recent uploads (local storage only - no Firebase needed)
const recentUploads = ref([])

// Computed
const canProcess = computed(() => {
  return selectedFile.value || capturedImage.value
})

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size exceeds 10MB limit. Please choose a smaller image.')
      return
    }
    selectedFile.value = file
    capturedImage.value = ''
    processingError.value = null
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please choose a smaller image.')
      return
    }
    selectedFile.value = file
    capturedImage.value = ''
    processingError.value = null
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  imagePreview.value = ''
  hasResults.value = false
  processingError.value = null
  pestScanResult.value = null
  pestScanError.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Camera Methods
const initializeCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: isCameraFlipped.value ? 'user' : 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    })
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      isCameraReady.value = true
    }
  } catch (error) {
    console.error('Camera error:', error)
    alert('Unable to access camera. Please check permissions.')
  }
}

const captureImage = () => {
  if (!videoElement.value) return
  
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoElement.value, 0, 0)
  
  capturedImage.value = canvas.toDataURL('image/jpeg')
  selectedFile.value = null
  processingError.value = null
  pestScanResult.value = null
  pestScanError.value = null
  
  // Stop camera stream
  const stream = videoElement.value.srcObject
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}

const useCapturedImage = () => {
  selectedFile.value = new File(
    [dataURLtoBlob(capturedImage.value)], 
    `capture_${Date.now()}.jpg`, 
    { type: 'image/jpeg' }
  )
  imagePreview.value = capturedImage.value
  activeTab.value = 'upload'
}

const retakePhoto = () => {
  capturedImage.value = ''
  selectedFile.value = null
  hasResults.value = false
  processingError.value = null
  pestScanResult.value = null
  pestScanError.value = null
  initializeCamera()
}

const toggleCamera = () => {
  isCameraFlipped.value = !isCameraFlipped.value
  initializeCamera()
}

const dataURLtoBlob = (dataURL) => {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// API Functions
const checkBackendConnection = async () => {
  try {
    console.log('🔌 Checking backend connection...')
    
    // Try to connect with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch('http://143.198.90.26/health', {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Backend connected successfully:', data)
      backendError.value = null
      backendConnected.value = true
      
      // Check model status
      try {
        const modelResponse = await fetch('http://143.198.90.26/api/model/status', {
          signal: AbortSignal.timeout(3000)
        })
        if (modelResponse.ok) {
          modelStatus.value = await modelResponse.json()
          console.log('✅ Model status:', modelStatus.value)
        }
      } catch (modelError) {
        console.warn('Model status check failed:', modelError)
      }
      
      return true
    } else {
      backendError.value = `Backend returned status: ${response.status}`
      backendConnected.value = false
      return false
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message)
    backendError.value = 'Cannot connect to backend server. Please make sure:'
    backendConnected.value = false
    return false
  }
}

// MAIN PROCESSING FUNCTION - NO FIREBASE STORAGE NEEDED
// Helper functions - UPDATE THESE
const formatDiseaseName = (disease) => {
  if (!disease || disease === 'healthy') return 'Healthy'
  
  return disease
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const scanForPest = async () => {
  if (!canProcess.value) return

  isPestScanning.value = true
  pestScanError.value = null
  pestScanResult.value = null

  try {
    let fileToProcess

    if (selectedFile.value) {
      fileToProcess = selectedFile.value
    } else if (capturedImage.value) {
      fileToProcess = new File(
        [dataURLtoBlob(capturedImage.value)],
        `capture_${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      )
    }

    if (!fileToProcess) {
      throw new Error('No image to process')
    }

    const formData = new FormData()
    formData.append('image', fileToProcess)

    let fallback = false
    try {
      const response = await fetch('http://143.198.90.26/api/pest-detect', {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        fallback = true
      } else {
        const data = await response.json()
        if (!data.success) {
          fallback = true
        } else {
          const pred = data.prediction || {}
          pestScanResult.value = {
            pest: pred.pest || 'Unknown',
            confidence: Math.round((pred.confidence || 0.8) * 100),
            note: pred.message || 'Pest scan completed successfully.',
            availablePests: pred.available_pests || [],
            recommendations: pred.recommendations || []
          }
          return
        }
      }
    } catch (error) {
      fallback = true
    }

    if (fallback) {
      const localPests = ['Aphids', 'Whiteflies', 'Spider Mites', 'Thrips']
      const pest = localPests[Math.floor(Math.random() * localPests.length)]
      pestScanResult.value = {
        pest,
        confidence: Math.round(75 + Math.random() * 20),
        note: 'Offline fallback pest scan completed. This does not affect the disease model.',
        availablePests: localPests,
        recommendations: []
      }
    }
  } catch (error) {
    console.error('Pest scan error:', error)
    pestScanError.value = error.message || 'Unable to complete pest scan.'
  } finally {
    isPestScanning.value = false
  }
}

// FIXED: Use 'healthy' as the key, not 'Fresh'
const getSymptomsForDisease = (disease) => {
  const symptomsMap = {
    'healthy': ['Normal leaf coloration', 'No visible lesions', 'Proper leaf shape'],
    'angular_leaf_spot': ['Angular water-soaked spots', 'Yellow halos around lesions', 'Leaf wilting'],
    'downy_mildew': ['Yellow angular spots', 'Purple mold on underside', 'Leaf curling'],
    'anthracnose': ['Brown sunken lesions', 'Pink spore masses', 'Fruit rot'],
    'powdery_mildew': ['White powdery coating', 'Leaf yellowing', 'Stunted growth'],
    'bacterial_wilt': ['Sudden wilting', 'Ooze from stems', 'Leaf discoloration'],
    'gummy_stem_blight': ['Gummy stem cankers', 'Brown leaf spots', 'Vine wilting'],
    'pythium_fruit_rot': ['Water-soaked fruit lesions', 'White cottony growth', 'Fruit rot']
  }
  
  // Convert disease to lowercase and handle different formats
  const diseaseKey = disease?.toLowerCase().replace(/\s+/g, '_') || 'unknown'
  
  return symptomsMap[diseaseKey] || ['Abnormal leaf appearance', 'Discoloration', 'Lesions present']
}

// UPDATE the processImage function's backend result handling
// Simplified processImage - NO Firebase Storage, just Base64 images
const processImage = async () => {
  if (!canProcess.value) return
  
  isProcessing.value = true
  hasResults.value = false
  processingError.value = null
  pestScanResult.value = null
  pestScanError.value = null
  
  try {
    // Get the file to process
    let fileToProcess
    let imageBase64
    
    if (selectedFile.value) {
      fileToProcess = selectedFile.value
      imageBase64 = imagePreview.value // Already base64 from FileReader
    } else if (capturedImage.value) {
      // Convert captured image to File and get base64
      fileToProcess = new File(
        [dataURLtoBlob(capturedImage.value)], 
        `capture_${Date.now()}.jpg`, 
        { type: 'image/jpeg' }
      )
      imageBase64 = capturedImage.value // Already base64 from canvas
    }
    
    if (!fileToProcess) {
      throw new Error('No image to process')
    }
    
    console.log('Processing file:', fileToProcess.name)
    
    // Try to use real backend if available
    let backendResult = null
    if (backendConnected.value) {
      try {
        const formData = new FormData()
        formData.append('image', fileToProcess)
        
        const response = await fetch('http://143.198.90.26/api/detect', {
          method: 'POST',
          body: formData,
          signal: AbortSignal.timeout(10000)
        })
        
        if (response.ok) {
          backendResult = await response.json()
          console.log('Backend analysis successful:', backendResult)
        }
      } catch (backendError) {
        console.warn('Backend processing failed, using mock data:', backendError.message)
      }
    }
    
    // Use backend result if available, otherwise use mock data
    let result
    if (backendResult && backendResult.success) {
      const pred = backendResult.prediction
      const diseaseKey = pred.disease || 'healthy'
      
      const isFresh = diseaseKey === 'healthy' || 
                     diseaseKey.toLowerCase().includes('fresh') ||
                     pred.disease_display?.toLowerCase().includes('fresh')
      
      result = {
        status: isFresh ? 'healthy' : (pred.status || (diseaseKey === 'healthy' ? 'healthy' : 'infected')),
        confidence: Math.round((pred.confidence || 0.95) * 100),
        disease: isFresh ? 'Healthy' : (pred.disease_display || formatDiseaseName(diseaseKey)),
        diseaseKey: isFresh ? 'healthy' : diseaseKey,
        symptoms: pred.symptoms || getSymptomsForDisease(isFresh ? 'healthy' : diseaseKey),
        recommendations: pred.recommendations || pred.suggestions || getDefaultRecommendations(isFresh ? 'healthy' : diseaseKey),
        all_predictions: pred.all_predictions || {},
        timestamp: pred.timestamp || new Date().toISOString(),
        fromBackend: true
      }
    } else {
      result = getMockResult()
      result.timestamp = new Date().toISOString()
      result.fromBackend = false
    }
    
    // Update UI with results
    analysisResult.value = result
    hasResults.value = true
    
    // Save to Firestore with Base64 image (NO Firebase Storage!)
    const user = auth.currentUser
    if (user) {
      try {
        // Prepare data for Firestore - including Base64 image
        const uploadData = {
          userId: user.uid,
          userEmail: user.email,
          fileName: fileToProcess.name,
          fileSize: fileToProcess.size,
          fileType: fileToProcess.type,
          
          // Store the Base64 image directly in Firestore
          imageUrl: imageBase64, // This is the key part!
          
          // Analysis results
          disease: result.disease,
          confidence: result.confidence,
          status: result.status,
          symptoms: result.symptoms,
          recommendations: result.recommendations,
          allPredictions: result.all_predictions,
          fromBackend: result.fromBackend,
          
          // Metadata
          timestamp: serverTimestamp(),
          processedAt: new Date().toISOString(),
          uploadMethod: activeTab.value,
          isDemo: !result.fromBackend // Mark as demo if using mock data
        }
        
        const docRef = await addDoc(collection(db, 'uploads'), uploadData)
        console.log('✅ Analysis saved to Firestore with Base64 image:', docRef.id)
        
        // Add to recent uploads
        const recentUpload = {
          id: docRef.id,
          name: fileToProcess.name,
          date: 'Just now',
          status: result.status,
          disease: result.disease,
          confidence: result.confidence,
          image: imageBase64, // Store Base64 image
          timestamp: new Date().toISOString(),
          isDemo: !result.fromBackend
        }
        
        saveToRecentUploads(recentUpload)
        
      } catch (firestoreError) {
        console.error('Firestore save failed:', firestoreError)
        // Still save to local storage
        const recentUpload = {
          id: Date.now().toString(),
          name: fileToProcess.name,
          date: 'Just now',
          status: result.status,
          disease: result.disease,
          confidence: result.confidence,
          image: imageBase64,
          timestamp: new Date().toISOString(),
          isDemo: !result.fromBackend
        }
        saveToRecentUploads(recentUpload)
      }
    } else {
      // User not logged in, save locally only
      const recentUpload = {
        id: Date.now().toString(),
        name: fileToProcess.name,
        date: 'Just now',
        status: result.status,
        disease: result.disease,
        confidence: result.confidence,
        image: imageBase64,
        timestamp: new Date().toISOString(),
        isDemo: !result.fromBackend
      }
      saveToRecentUploads(recentUpload)
      
      // Optional: Prompt to login
      setTimeout(() => {
        if (confirm('Want to save your analysis history? Please log in.')) {
          router.push('/login')
        }
      }, 1000)
    }
    
  } catch (error) {
    console.error('Processing error:', error)
    processingError.value = error.message
    
    // Fallback to mock data
    if (!hasResults.value) {
      setTimeout(() => {
        analysisResult.value = {
          ...getMockResult(),
          timestamp: new Date().toISOString(),
          fromBackend: false
        }
        hasResults.value = true
      }, 500)
    }
  } finally {
    isProcessing.value = false
  }
}

// UPDATE the getMockResult function to ensure healthy is always shown correctly
const getMockResult = () => {
  // 50% chance of getting healthy result for better testing
  const useHealthy = Math.random() > 0.5
  
  if (useHealthy) {
    return {
      status: 'healthy',
      confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
      disease: 'Healthy',
      symptoms: ['Normal leaf coloration', 'No visible lesions', 'Proper leaf shape'],
      recommendations: [
        'Continue regular watering schedule',
        'Maintain optimal sunlight exposure',
        'Monitor for any changes weekly',
        'Apply balanced fertilizer as recommended'
      ],
      all_predictions: {
        healthy: 0.92,
        angular_leaf_spot: 0.02,
        downy_mildew: 0.02,
        anthracnose: 0.01,
        powdery_mildew: 0.02,
        bacterial_wilt: 0.01
      }
    }
  }
  
  // Random infected disease
  const diseases = [
    {
      status: 'infected',
      confidence: Math.floor(Math.random() * 20) + 75,
      disease: 'Powdery Mildew',
      symptoms: ['White powdery spots', 'Yellowing leaves', 'Leaf curling'],
      recommendations: [
        'Apply fungicide treatment',
        'Increase air circulation',
        'Remove infected leaves'
      ],
      all_predictions: {
        healthy: 0.10,
        angular_leaf_spot: 0.15,
        downy_mildew: 0.20,
        anthracnose: 0.10,
        powdery_mildew: 0.40,
        bacterial_wilt: 0.05
      }
    },
    {
      status: 'infected',
      confidence: Math.floor(Math.random() * 20) + 70,
      disease: 'Angular Leaf Spot',
      symptoms: ['Angular water-soaked spots', 'Yellow halos around lesions', 'Leaf wilting'],
      recommendations: [
        'Remove infected leaves immediately',
        'Apply copper-based fungicide',
        'Improve air circulation'
      ],
      all_predictions: {
        healthy: 0.05,
        angular_leaf_spot: 0.60,
        downy_mildew: 0.15,
        anthracnose: 0.10,
        powdery_mildew: 0.05,
        bacterial_wilt: 0.05
      }
    }
  ]
  
  return diseases[Math.floor(Math.random() * diseases.length)]
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
const formatRelativeTime = (date) => {
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
}
// Recent uploads management (local storage only)
const loadRecentUploads = async () => {
  try {
    // Try to load from localStorage first
    const saved = localStorage.getItem('cucumber_recent_uploads')
    if (saved) {
      recentUploads.value = JSON.parse(saved)
    }
    
    // Load from Firestore
    const user = auth.currentUser
    if (user) {
      loadingUploads.value = true
      
      const q = query(
        collection(db, 'uploads'),
        orderBy('timestamp', 'desc'),
        where('userId', '==', user.uid)
      )
      
      const querySnapshot = await getDocs(q)
      const uploads = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        uploads.push({
          id: doc.id,
          name: data.fileName,
          date: data.timestamp?.toDate() ? formatRelativeTime(data.timestamp.toDate()) : 'Recently',
          status: data.status,
          disease: data.disease,
          confidence: data.confidence,
          image: data.imageUrl, // This will be the Base64 string
          timestamp: data.timestamp?.toDate() || new Date(),
          isDemo: data.isDemo || false
        })
      })
      
      if (uploads.length > 0) {
        recentUploads.value = uploads
      }
      
      loadingUploads.value = false
    }
  } catch (error) {
    console.error('Failed to load recent uploads:', error)
    loadingUploads.value = false
  }
}
const saveToRecentUploads = (upload) => {
  // Add to beginning of array
  recentUploads.value.unshift(upload)
  
  // Keep only last 10 items
  if (recentUploads.value.length > 10) {
    recentUploads.value = recentUploads.value.slice(0, 10)
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('cucumber_recent_uploads', JSON.stringify(
      recentUploads.value.map(u => ({
        id: u.id,
        name: u.name,
        date: u.date,
        status: u.status,
        disease: u.disease,
        confidence: u.confidence,
        image: u.image
      }))
    ))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

const saveReport = () => {
  const report = {
    ...analysisResult.value,
    imageData: imagePreview.value || capturedImage.value,
    processedAt: new Date().toISOString(),
    fileName: selectedFile.value?.name || 'captured_image.jpg'
  }
  
  // Convert to JSON and download
  const dataStr = JSON.stringify(report, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `cucumber_report_${Date.now()}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  
  alert('Report saved successfully!')
}

const viewHistory = () => {
  router.push('/history')
}

// Lifecycle hooks
onMounted(() => {
  // Check backend connection on component mount
  checkBackendConnection()
  loadRecentUploads()
})

// Cleanup
onUnmounted(() => {
  if (videoElement.value && videoElement.value.srcObject) {
    const stream = videoElement.value.srcObject
    stream.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
/* Add these new styles */
.pest-result-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%);
  border: 1px solid #fdba74;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
}

.pest-result-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.pest-result-header h4 {
  margin: 0;
  color: #9a2c00;
  font-size: 1rem;
}

.pest-subtitle {
  margin: 4px 0 0;
  color: #b45309;
  font-size: 0.8rem;
}

.pest-badge {
  background: #f97316;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.pest-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pest-confidence {
  font-weight: 700;
  color: #c2410c;
  margin: 0;
}

.pest-section h5 {
  margin: 0 0 4px;
  color: #9a2c00;
  font-size: 0.9rem;
}

.pest-section p,
.pest-section li {
  color: #7c2d12;
  font-size: 0.9rem;
  line-height: 1.5;
}

.pest-section ul {
  margin: 0;
  padding-left: 18px;
}

.pest-note {
  color: #9a2c00;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.pest-note.subtle {
  color: #b45309;
  font-size: 0.8rem;
  margin-top: 4px;
}

.pest-btn {
  margin-top: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pest-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(234, 88, 12, 0.2);
}

.pest-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.process-warning {
  color: #f59e0b;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 8px;
  padding: 8px;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 6px;
}

.mock-data-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.2s ease;
}

.mock-data-btn:hover {
  background: #2563eb;
}

.result-meta {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #64748b;
}

.mock-note {
  color: #f59e0b;
  font-size: 0.75rem;
  margin-top: 8px;
}

.upload-disease {
  color: #475569;
  font-size: 0.75rem;
  margin-top: 4px;
  font-weight: 500;
}

/* Rest of your existing styles remain the same */
.upload-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
  margin: 5px auto 0;
  max-width: 1200px;
}

.upload-header {
  margin-bottom: 32px;
}

.upload-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.upload-subtitle {
  color: #64748b;
  font-size: 1.125rem;
}

/* Backend Warning */
.backend-warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.warning-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 4px;
}

.backend-warning h4 {
  color: #d97706;
  font-weight: 600;
  margin-bottom: 8px;
}

.backend-warning p {
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 12px;
}

.backend-instructions {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}

.backend-instructions p {
  margin-bottom: 8px;
}

.backend-instructions ol {
  margin-left: 20px;
  color: #78350f;
}

.backend-instructions li {
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.backend-instructions code {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8em;
}

/* Model Status Bar */
.model-status-bar {
  display: flex;
  gap: 24px;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  color: #64748b;
  font-size: 0.875rem;
}

.status-value {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f1f5f9;
}

.status-value.status-ready {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.upload-main {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  margin: 0 auto 48px;
  width: 100%;
  max-width: 1180px;
}

/* Upload Options */
.upload-options {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.upload-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: none;
  border-radius: 10px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: rgba(16, 185, 129, 0.05);
  color: #10b981;
}

.tab-btn.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.tab-icon {
  width: 20px;
  height: 20px;
}

/* Drop Zone */
.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.drop-zone:hover,
.drop-zone.drag-over {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.02);
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #94a3b8;
}

.drop-zone:hover .upload-icon,
.drop-zone.drag-over .upload-icon {
  color: #10b981;
}

.drop-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.drop-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.drop-info {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 8px;
}

.hidden-input {
  display: none;
}

/* File Preview */
.file-preview {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
}

.file-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.file-size {
  color: #64748b;
  font-size: 0.75rem;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.image-preview {
  padding: 16px;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

/* Camera Area */
.camera-area {
  margin-bottom: 24px;
}

.camera-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  margin-bottom: 16px;
}

.camera-preview,
.captured-preview {
  position: relative;
  width: 100%;
  height: 600px;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

.camera-video.flipped {
  transform: scaleX(1);
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crop-guide {
  width: 300px;
  height: 300px;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.captured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-controls {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.capture-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid white;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.capture-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.capture-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.capture-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
}

.capture-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  border: 2px solid white;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn.retake:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.action-btn.use:hover {
  border-color: #10b981;
  color: #10b981;
}

.camera-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid white;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.camera-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.camera-instructions {
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  padding: 8px;
}

/* Processing Section */
.processing-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.process-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.process-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.process-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.process-btn.loading {
  background: linear-gradient(135deg, #64748b, #94a3b8);
}

.process-icon {
  width: 24px;
  height: 24px;
}

.process-hint {
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 8px;
}

/* Results Panel */
.results-panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.results-header {
  margin-bottom: 24px;
}

.results-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.results-header p {
  color: #64748b;
  font-size: 0.875rem;
}

/* Loading Results */
.loading-results {
  text-align: center;
  padding: 48px 24px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #10b981;
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-sub {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 8px;
}

/* Error Message */
.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-top: 20px;
}

.error-icon {
  width: 24px;
  height: 24px;
  color: #dc2626;
  flex-shrink: 0;
  margin-top: 4px;
}

.error-message h4 {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 8px;
}

.error-message p {
  color: #7f1d1d;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Results Display */
.result-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.result-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.result-status.healthy {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.result-status.infected {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.confidence-level {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.confidence-bar {
  width: 150px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 1s ease;
}

.confidence-text {
  font-size: 0.75rem;
  color: #64748b;
}

/* Probability Chart */
.probability-chart {
  margin: 20px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.probability-chart h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.probability-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.probability-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.prob-label {
  min-width: 120px;
  font-size: 0.875rem;
  color: #475569;
}

.prob-bar-container {
  flex: 1;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.prob-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 12px;
  transition: width 1s ease;
}

.prob-percentage {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
}

/* Disease Info */
.disease-info {
  margin-bottom: 24px;
}

.disease-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.disease-name {
  font-size: 1.125rem;
  color: #475569;
  margin-bottom: 16px;
  font-weight: 500;
}

.symptoms-list h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.symptoms-list ul {
  list-style: none;
  padding-left: 0;
}

.symptoms-list li {
  padding: 4px 0;
  color: #475569;
  font-size: 0.875rem;
  position: relative;
  padding-left: 20px;
}

.symptoms-list li:before {
  content: "•";
  color: #10b981;
  position: absolute;
  left: 0;
}

/* Recommendations */
.recommendations {
  margin-bottom: 24px;
}

.recommendations h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.recommendation-item:last-child {
  border-bottom: none;
}

.rec-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.recommendation-item span {
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Result Actions */
.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.save-btn,
.history-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.save-btn:hover {
  background: rgba(16, 185, 129, 0.2);
}

.history-btn {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.history-btn:hover {
  background: rgba(100, 116, 139, 0.2);
}

/* Recent Uploads */
.recent-uploads {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.recent-uploads h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.uploads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.upload-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.upload-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.upload-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
  background: #f8fafc;
}

.upload-details {
  padding: 12px;
}

.upload-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.upload-date {
  color: #64748b;
  font-size: 0.75rem;
  margin-bottom: 8px;
}

.upload-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.upload-status.healthy {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.upload-status.infected {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .upload-main {
    grid-template-columns: 1fr;
  }
  
  .results-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .upload-container {
    padding: 16px;
    border-radius: 16px;
  }
  
  .upload-title {
    font-size: 1.5rem;
  }
  
  .upload-tabs {
    flex-direction: column;
  }
  
  .upload-main {
    grid-template-columns: 1fr;
    max-width: 100%;
    margin: 0 auto 48px;
  }
  
  .upload-options,
  .results-panel {
    width: 100%;
    max-width: 100%;
  }
  
  .drop-zone {
    padding: 28px 18px;
  }
  
  .camera-preview,
  .captured-preview {
    height: 260px;
  }
  
  .capture-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .uploads-grid {
    grid-template-columns: 1fr;
  }
  
  .model-status-bar {
    flex-direction: column;
    gap: 12px;
  }
  
  .results-panel {
    margin-top: 0;
  }
}
</style>
