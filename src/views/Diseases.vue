<template>
  <div class="diseases-page">
    <!-- Background Elements -->
    <div class="page-bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
    </div>

    <!-- Main Content - Adjusted for sidebar -->
    <div class="diseases-content">
      <!-- Header Section -->
      <div class="diseases-header">
        <div class="header-left">
          <div class="header-badge">
            <span class="badge-text">Disease Reference</span>
            <div class="badge-glow"></div>
          </div>
          <h1 class="page-title">
            <span class="title-line">Cucumber Disease</span>
            <span class="title-line gradient-text">Knowledge Base</span>
          </h1>
          <p class="page-subtitle">
            Comprehensive guide to identifying, preventing, and treating cucumber diseases.
          </p>
        </div>

        <!-- Search and Filter - Compact Version -->
        <div class="header-right">
          <div class="search-container">
            <div class="search-box">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="Search diseases..."
              />
              <div v-if="searchQuery" class="search-clear" @click="clearSearch">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="filter-buttons">
            <button 
              v-for="category in categories" 
              :key="category.value"
              :class="{ active: activeCategory === category.value }"
              @click="toggleCategory(category.value)"
              class="filter-btn"
            >
              {{ category.label }}
              <span class="filter-count">{{ getCategoryCount(category.value) }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats - Compact Grid -->
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="currentColor" stroke-width="2"/>
              <path d="M7 14l4-4 4 4 4-4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ diseases.length }}</div>
            <div class="stat-label">Total Diseases</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ highSeverityCount }}</div>
            <div class="stat-label">High Risk</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ fungalCount }}</div>
            <div class="stat-label">Fungal</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 8v5" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16h.01" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ bacterialCount }}</div>
            <div class="stat-label">Bacterial</div>
          </div>
        </div>
      </div>

      <!-- Search Results Info -->
      <div class="results-info">
        <span>Showing <strong>{{ filteredDiseases.length }}</strong> of <strong>{{ diseases.length }}</strong> diseases</span>
        <button v-if="hasActiveFilters" @click="resetFilters" class="reset-link">
          Clear filters
        </button>
      </div>

      <!-- Disease Grid - Compact Cards -->
      <div class="disease-grid" v-if="filteredDiseases.length > 0">
        <div 
          v-for="disease in filteredDiseases" 
          :key="disease.id" 
          class="disease-card"
          :class="disease.severity.toLowerCase()"
          @click="openDiseaseDetail(disease)"
        >
          <div class="card-header">
            <div class="card-badge" :class="disease.category.toLowerCase().replace('-', '')">
              {{ disease.category }}
            </div>
            <div class="severity-indicator" :class="disease.severity.toLowerCase()">
              <span class="severity-dot"></span>
              <span class="severity-text">{{ disease.severity }}</span>
            </div>
          </div>
          
          <h3 class="disease-name">{{ disease.name }}</h3>
          
          <div class="symptoms-preview">
            <div class="preview-label">
              <svg class="preview-icon" viewBox="0 0 24 24" fill="none">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <span>Key Symptoms</span>
            </div>
            <div class="symptoms-tags">
              <span v-for="(symptom, index) in disease.symptoms.slice(0, 2)" :key="index" class="symptom-tag">
                {{ symptom }}
              </span>
              <span v-if="disease.symptoms.length > 2" class="more-tag">
                +{{ disease.symptoms.length - 2 }}
              </span>
            </div>
          </div>

          <div class="detection-rate">
            <div class="rate-label">
              <span>AI Detection</span>
              <span class="rate-value">{{ getDetectionRate(disease) }}%</span>
            </div>
            <div class="rate-bar">
              <div class="rate-fill" :style="{ width: getDetectionRate(disease) + '%' }"></div>
            </div>
          </div>

          <div class="card-footer">
            <span class="view-link">
              View Details
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" 
                      stroke="currentColor" stroke-width="2"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h3>No diseases found</h3>
        <p>Try adjusting your search or filters</p>
        <button class="reset-filters-btn" @click="resetFilters">
          Reset Filters
        </button>
      </div>

      <!-- Info Banner - Compact -->
      <div class="info-banner">
        <div class="banner-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="banner-text">
          <strong>Need a diagnosis?</strong> Upload images of affected plants for AI-powered analysis
        </div>
        <button class="banner-btn" @click="goToUpload">
          Start Detection
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" 
                  stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Fungal', value: 'Fungal' },
  { label: 'Bacterial', value: 'Bacterial' },
  { label: 'Viral', value: 'Viral' },
  { label: 'Soil', value: 'Soil-borne' }
]

const diseases = [
  {
    id: 'angular_leaf_spot',
    name: 'Angular Leaf Spot',
    category: 'Bacterial',
    severity: 'Medium',
    symptoms: [
      'Angular, water-soaked lesions',
      'Yellow halos around spots',
      'Leaf tearing'
    ],
    causes: ['Pseudomonas syringae', 'Overhead irrigation', 'Infected seed'],
    actions: ['Remove infected leaves', 'Use copper bactericides', 'Improve airflow']
  },
  {
    id: 'downy_mildew',
    name: 'Downy Mildew',
    category: 'Fungal',
    severity: 'High',
    symptoms: [
      'Yellow angular spots',
      'Purple-gray fuzz underside',
      'Rapid leaf collapse'
    ],
    causes: ['Pseudoperonospora cubensis', 'High humidity', 'Cool nights'],
    actions: ['Apply fungicides early', 'Water at soil level', 'Increase spacing']
  },
  {
    id: 'powdery_mildew',
    name: 'Powdery Mildew',
    category: 'Fungal',
    severity: 'Medium',
    symptoms: [
      'White powdery growth',
      'Leaf yellowing',
      'Leaf curling'
    ],
    causes: ['Podosphaera xanthii', 'Warm days, cool nights', 'Crowded planting'],
    actions: ['Remove infected leaves', 'Apply sulfur', 'Improve airflow']
  },
  {
    id: 'bacterial_wilt',
    name: 'Bacterial Wilt',
    category: 'Bacterial',
    severity: 'High',
    symptoms: [
      'Sudden wilting of vines',
      'Sticky ooze from stems',
      'Rapid plant collapse'
    ],
    causes: ['Erwinia tracheiphila', 'Cucumber beetles', 'Infected debris'],
    actions: ['Remove infected plants', 'Control beetles', 'Use resistant varieties']
  },
  {
    id: 'anthracnose',
    name: 'Anthracnose',
    category: 'Fungal',
    severity: 'High',
    symptoms: [
      'Brown sunken lesions',
      'Pink spore masses',
      'Fruit rot'
    ],
    causes: ['Colletotrichum orbiculare', 'Infected debris', 'Warm, wet conditions'],
    actions: ['Remove infected material', 'Crop rotation', 'Apply fungicides']
  },
  {
    id: 'mosaic_virus',
    name: 'Mosaic Virus',
    category: 'Viral',
    severity: 'Medium',
    symptoms: [
      'Mottled leaves',
      'Leaf distortion',
      'Stunted growth'
    ],
    causes: ['Aphid transmission', 'Infected weeds', 'Mechanical spread'],
    actions: ['Remove infected plants', 'Control aphids', 'Manage weeds']
  }
]

const filteredDiseases = computed(() => {
  let result = diseases
  
  if (activeCategory.value !== 'all') {
    result = result.filter(d => d.category === activeCategory.value)
  }
  
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    result = result.filter(d => 
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.symptoms.some(s => s.toLowerCase().includes(q))
    )
  }
  
  return result
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || activeCategory.value !== 'all'
})

const highSeverityCount = computed(() => {
  return diseases.filter(d => d.severity === 'High').length
})

const fungalCount = computed(() => {
  return diseases.filter(d => d.category === 'Fungal').length
})

const bacterialCount = computed(() => {
  return diseases.filter(d => d.category === 'Bacterial').length
})

const getCategoryCount = (category) => {
  if (category === 'all') return diseases.length
  return diseases.filter(d => d.category === category).length
}

const getDetectionRate = (disease) => {
  const rates = {
    'Fungal': 95,
    'Bacterial': 92,
    'Viral': 88,
    'Soil-borne': 90
  }
  return rates[disease.category] || 90
}

const toggleCategory = (category) => {
  activeCategory.value = category
}

const clearSearch = () => {
  searchQuery.value = ''
}

const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
}

const openDiseaseDetail = (disease) => {
  console.log('Open:', disease.name)
  // Implement modal or navigation
}

const goToUpload = () => {
  router.push('/upload')
}
</script>

<style scoped>
.diseases-page {
  min-height: 100vh;
  margin: 5px auto;
  max-width: 1200px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.page-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.1;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #10b981, transparent 70%);
  top: -100px;
  left: -100px;
  animation: pulse 8s ease-in-out infinite;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
  bottom: -100px;
  right: -100px;
  animation: pulse 12s ease-in-out infinite reverse;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.diseases-content {
  min-height: 100%;
  overflow-y: auto;
  padding: 24px 20px;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
}

/* Hide scrollbar but keep functionality */
.diseases-content::-webkit-scrollbar {
  width: 4px;
}

.diseases-content::-webkit-scrollbar-track {
  background: transparent;
}

.diseases-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.diseases-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Header */
.diseases-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.header-left {
  flex: 1;
  min-width: 300px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 50px;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
}

.badge-text {
  color: #10b981;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 2;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.2;
  color: #0f172a;
  margin-bottom: 6px;
}

.title-line {
  display: block;
}

.gradient-text {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  max-width: 500px;
}

.header-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 300px;
}

.search-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.search-input {
  width: 80%;
  padding: 10px 12px 10px 38px;
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #0f172a;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
}

.search-clear svg {
  width: 14px;
  height: 14px;
}

.filter-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.filter-btn:hover:not(.active) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 500;
}

.filter-btn:not(.active) .filter-count {
  background: #f1f5f9;
  color: #64748b;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 20px;
  height: 20px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

/* Results Info */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.75rem;
  color: #64748b;
}

.reset-link {
  background: none;
  border: none;
  color: #10b981;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.75rem;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Disease Grid */
.disease-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.disease-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.disease-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: #e2e8f0;
}

.disease-card.high:hover {
  border-color: rgba(239, 68, 68, 0.3);
}

.disease-card.medium:hover {
  border-color: rgba(245, 158, 11, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.card-badge.fungal {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.card-badge.bacterial {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.card-badge.viral {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.card-badge.soilborne {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.severity-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.severity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.severity-indicator.high .severity-dot {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.severity-indicator.medium .severity-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
}

.severity-text {
  font-size: 0.65rem;
  font-weight: 600;
  color: #64748b;
}

.disease-name {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
  line-height: 1.3;
}

.symptoms-preview {
  margin-bottom: 12px;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
}

.preview-icon {
  width: 12px;
  height: 12px;
  color: #94a3b8;
}

.symptoms-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.symptom-tag {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.65rem;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.more-tag {
  background: #f1f5f9;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 500;
}

.detection-rate {
  margin-bottom: 12px;
}

.rate-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 4px;
}

.rate-value {
  font-weight: 600;
  color: #10b981;
}

.rate-bar {
  height: 4px;
  background: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 2px;
  transition: width 1s ease;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.view-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #10b981;
}

.view-link svg {
  width: 14px;
  height: 14px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  margin-bottom: 20px;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: #f8fafc;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.empty-icon svg {
  width: 28px;
  height: 28px;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.empty-state p {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.reset-filters-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
}

.reset-filters-btn:hover {
  background: #059669;
}

/* Info Banner */
.info-banner {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05));
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.banner-icon {
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  flex-shrink: 0;
}

.banner-icon svg {
  width: 18px;
  height: 18px;
}

.banner-text {
  flex: 1;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.4;
}

.banner-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.banner-btn svg {
  width: 14px;
  height: 14px;
}

/* Responsive */
@media (max-width: 1200px) {
  .disease-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 900px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .diseases-page {
    margin: 5px 10px;
    border-radius: 16px;
  }

  .diseases-content {
    padding: 16px;
    max-width: 100%;
  }

  .diseases-header {
    flex-direction: column;
  }
  
  .header-right {
    width: 100%;
  }
  
  .filter-buttons {
    justify-content: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .disease-grid {
    grid-template-columns: 1fr;
  }

  .results-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>