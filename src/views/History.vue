<template>
  <div class="history-container">
    <!-- Header -->
    <div class="history-header">
      <div class="header-content">
        <h1 class="history-title">{{ t('historyTitle') }}</h1>
        <p class="history-subtitle">{{ t('historySubtitle') }}</p>
        <div class="header-actions">
          <button @click="refreshData" class="refresh-btn" :disabled="loading">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 20V14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 14 3.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.51 15C4.0172 16.4332 4.87907 17.7146 6.01547 18.7246C7.15186 19.7346 8.52549 20.4402 10 20.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ t('refresh') }}
          </button>
          <button 
            v-if="displayHistory.length > 0" 
            @click="downloadBatchReport(displayHistory)" 
            class="refresh-btn batch-download"
            :disabled="loading"
          >
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 16V4M8 12L12 16L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 16V20H4V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ t('downloadAllPdf') }}
          </button>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-icon healthy">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 12L11 15L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ healthyCount }}</p>
            <p class="stat-label">{{ t('healthyPlants') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon infected">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ infectedCount }}</p>
            <p class="stat-label">{{ t('infectedDetected') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ history.length }}</p>
            <p class="stat-label">{{ t('totalAnalyses') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner-large"></div>
      <p>{{ t('loadingHistory') }}</p>
    </div>

    <!-- Filters and Search -->
    <div v-if="!loading && history.length > 0" class="history-controls">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="t('searchHistory')"
          class="search-input"
        />
      </div>
      
      <div class="filter-controls">
        <div class="filter-group">
          <label class="filter-label">{{ t('status') }}:</label>
          <div class="filter-chips">
            <button 
              v-for="status in statusFilters" 
              :key="status.id"
              @click="toggleStatusFilter(status.id)"
              class="filter-chip"
              :class="{ 'active': activeFilters.status.includes(status.id) }"
            >
              {{ t(status.labelKey) }}
              <span class="chip-count">{{ getStatusCount(status.id) }}</span>
            </button>
            <button 
              @click="clearFilters"
              class="filter-chip clear"
              v-if="hasActiveFilters"
            >
              {{ t('clearFilters') }}
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">{{ t('dateRange') }}:</label>
          <div class="date-filters">
            <button 
              v-for="range in dateRanges" 
              :key="range.id"
              @click="setDateRange(range.id)"
              class="date-filter"
              :class="{ 'active': activeDateRange === range.id }"
            >
              {{ t(range.labelKey) }}
            </button>
          </div>
        </div>
        
        <div class="sort-controls">
          <label class="sort-label">{{ t('sortBy') }}:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="date-desc">{{ t('newestFirst') }}</option>
            <option value="date-asc">{{ t('oldestFirst') }}</option>
            <option value="confidence-desc">{{ t('highConfidence') }}</option>
            <option value="confidence-asc">{{ t('lowConfidence') }}</option>
            <option value="name-asc">{{ t('nameAZ') }}</option>
            <option value="name-desc">{{ t('nameZA') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- History Content -->
    <div v-if="!loading" class="history-content">
      <!-- Results Summary -->
      <div v-if="displayHistory.length > 0" class="results-summary">
        <p>
          {{ t('showingAnalyses', { shown: displayHistory.length, total: history.length }) }}
          <span v-if="hasActiveFilters" class="filter-notice">
            ({{ t('filtered') }})
          </span>
        </p>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid' && displayHistory.length > 0" class="history-grid">
        <div 
          v-for="item in displayHistory"
          :key="item.id"
          class="history-card"
          :class="item.status"
        >
          <div class="card-image">
            <img v-if="item.image" :src="item.image" :alt="item.filename" class="history-image" />
            <div v-else class="image-empty"></div>
            <div class="image-overlay">
              <button @click="viewDetails(item)" class="overlay-btn">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-header">
              <h4 class="card-title">{{ formatFilename(item.filename) }}</h4>
              <div class="card-status" :class="item.status">
                {{ item.recordType === 'pest' ? `🐛 ${t('pest')}` : item.status === 'healthy' ? `🌿 ${t('healthy')}` : `⚠️ ${t('infected')}` }}
              </div>
            </div>
            
            <div class="card-info">
              <div class="info-item">
                <svg class="info-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span class="info-text">{{ formatDate(item.uploadedAt) }}</span>
              </div>
            </div>
            
            <div class="card-disease">
              <p class="disease-label">{{ t(item.recordType === 'pest' ? 'detectedPest' : 'detectedDisease') }}:</p>
              <p class="disease-name">{{ item.disease || t('none') }}</p>
            </div>
            
            <div class="card-confidence">
              <div class="confidence-header">
                <span>{{ t('confidence') }}</span>
                <span class="confidence-value">{{ item.confidence }}%</span>
              </div>
              <div class="confidence-bar">
                <div 
                  class="confidence-fill"
                  :class="item.status"
                  :style="{ width: Math.min(item.confidence, 100) + '%' }"
                ></div>
              </div>
            </div>
            
            <div class="card-actions">
              <button @click="viewDetails(item)" class="action-btn view">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                View Details
              </button>
              <button @click="downloadReport(item)" class="action-btn download">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                PDF Report
              </button>
              <button @click="deleteItem(item)" class="action-btn delete">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-else-if="viewMode === 'table' && displayHistory.length > 0" class="history-table">
        <table>
          <thead>
            <tr>
              <th>{{ t('image') }}</th>
              <th>{{ t('filename') }}</th>
              <th>{{ t('status') }}</th>
              <th>{{ t('pestOrDisease') }}</th>
              <th>{{ t('confidence') }}</th>
              <th>{{ t('date') }}</th>
              <th>{{ t('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in displayHistory" :key="item.id">
              <td class="image-cell">
                <img v-if="item.image" :src="item.image" :alt="item.filename" class="table-image" />
                <div v-else class="table-image empty"></div>
              </td>
              <td class="filename-cell">
                <div>
                  <p class="filename">{{ formatFilename(item.filename) }}</p>
                  <p class="file-size">{{ formatFileSize(item.fileSize) }}</p>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="item.status">
                  {{ item.recordType === 'pest' ? t('pest') : item.status === 'healthy' ? t('healthy') : t('infected') }}
                </span>
              </td>
              <td>
                <div class="disease-cell">
                  <span class="disease-name">{{ item.disease || t('none') }}</span>
                </div>
              </td>
              <td>
                <div class="confidence-cell">
                  <div class="confidence-progress">
                    <div 
                      class="confidence-track"
                      :class="item.status"
                      :style="{ width: Math.min(item.confidence, 100) + '%' }"
                    ></div>
                  </div>
                  <span class="confidence-percent">{{ item.confidence }}%</span>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <p class="date">{{ formatDate(item.uploadedAt) }}</p>
                  <p class="time">{{ formatTime(item.uploadedAt) }}</p>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="viewDetails(item)" class="table-btn view" :title="t('viewDetails')">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button @click="downloadReport(item)" class="table-btn download" :title="t('downloadPdfReport')">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button @click="deleteItem(item)" class="table-btn delete" :title="t('delete')">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && displayHistory.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 17C9 18.6569 10.3431 20 12 20C13.6569 20 15 18.6569 15 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 11V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8.5 2H15.5L17 5H7L8.5 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 5H18C20.2091 5 22 6.79086 22 9V14C22 16.2091 20.2091 18 18 18H6C3.79086 18 2 16.2091 2 14V9C2 6.79086 3.79086 5 6 5Z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3 v-if="hasActiveFilters">{{ t('noMatchingAnalyses') }}</h3>
        <h3 v-else>{{ t('noHistoryYet') }}</h3>
        <p v-if="hasActiveFilters">{{ t('adjustHistorySearch') }}</p>
        <p v-else>{{ t('uploadFirstImage') }}</p>
        <button @click="goToUpload" class="upload-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M21 16V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ t('uploadFirst') }}
        </button>
        <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
          {{ t('clearAllFilters') }}
        </button>
      </div>
    </div>

    <!-- View Mode Toggle -->
    <div v-if="!loading && displayHistory.length > 0" class="view-toggle">
      <button 
        @click="viewMode = 'grid'"
        class="view-btn"
        :class="{ 'active': viewMode === 'grid' }"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        {{ t('grid') }}
      </button>
      <button 
        @click="viewMode = 'table'"
        class="view-btn"
        :class="{ 'active': viewMode === 'table' }"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" stroke-width="1.5"/>
          <path d="M3 9H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3 15H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M9 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{ t('table') }}
      </button>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedItem" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t('analysisDetails') }}</h3>
          <button @click="closeModal" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="detail-image">
            <img v-if="selectedItem.image" :src="selectedItem.image" :alt="selectedItem.filename" />
            <div v-else class="detail-image-empty"></div>
          </div>
          
          <div class="detail-info">
            <div class="detail-section">
              <h4>{{ t('fileInformation') }}</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">{{ t('filename') }}:</span>
                  <span class="info-value">{{ selectedItem.filename }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ t('fileSize') }}:</span>
                  <span class="info-value">{{ formatFileSize(selectedItem.fileSize) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ t('uploadDate') }}:</span>
                  <span class="info-value">{{ formatFullDate(selectedItem.uploadedAt) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ t('analysisId') }}:</span>
                  <span class="info-value">{{ selectedItem.id }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>{{ t('analysisResults') }}</h4>
              <div class="results-grid">
                <div class="result-item status">
                  <span class="result-label">{{ t('status') }}:</span>
                  <span class="result-value" :class="selectedItem.status">
                    {{ selectedItem.recordType === 'pest' ? t('pest') : selectedItem.status === 'healthy' ? t('healthy') : t('infected') }}
                  </span>
                </div>
                <div class="result-item confidence">
                  <span class="result-label">{{ t('confidence') }}:</span>
                  <span class="result-value">{{ selectedItem.confidence }}%</span>
                  <div class="confidence-bar">
                    <div 
                      class="confidence-fill"
                      :class="selectedItem.status"
                      :style="{ width: Math.min(selectedItem.confidence, 100) + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="result-item disease">
                  <span class="result-label">{{ t(selectedItem.recordType === 'pest' ? 'detectedPest' : 'detectedDisease') }}:</span>
                  <span class="result-value">{{ selectedItem.disease || t('none') }}</span>
                </div>
              </div>
            </div>
            
            <div v-if="selectedItem.symptoms && selectedItem.symptoms.length > 0" class="detail-section">
              <h4>{{ t('symptomsIdentified') }}</h4>
              <ul class="symptoms-list">
                <li v-for="(symptom, index) in selectedItem.symptoms" :key="index">
                  {{ symptom }}
                </li>
              </ul>
            </div>
            
            <div v-if="selectedItem.recommendations && selectedItem.recommendations.length > 0" class="detail-section">
              <h4>{{ t('recommendations') }}</h4>
              <ul class="recommendations-list">
                <li v-for="(rec, index) in selectedItem.recommendations" :key="index">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  {{ rec }}
                </li>
              </ul>
            </div>
            
            <div class="detail-section">
              <h4>{{ t('actions') }}</h4>
              <div class="action-buttons">
                <button @click="downloadReport(selectedItem)" class="modal-btn download">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ t('downloadPdfReport') }}
                </button>
                <button @click="reanalyzeItem(selectedItem)" class="modal-btn reanalyze">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 20V14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 14 3.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.51 15C4.0172 16.4332 4.87907 17.7146 6.01547 18.7246C7.15186 19.7346 8.52549 20.4402 10 20.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ t('reanalyze') }}
                </button>
                <button @click="deleteItem(selectedItem)" class="modal-btn delete">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ t('delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showReportOptions" class="modal-overlay" @click.self="cancelReportOptions">
      <section class="modal-content report-options-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3>{{ t(reportRequest.mode === 'single' ? 'reportOptionsSingle' : 'reportOptionsBatch') }}</h3>
          <button class="modal-close" :aria-label="t('close')" @click="cancelReportOptions">×</button>
        </div>
        <div class="report-options-body">
          <p>{{ t('chooseReportContent') }}</p>
          <fieldset v-if="reportRequest.mode === 'single'" class="report-options-group">
            <legend>{{ t('reportSections') }}</legend>
            <label v-for="option in availableSingleReportOptions" :key="option.key" class="report-option">
              <input v-model="reportOptions[option.key]" type="checkbox" />
              <span>{{ t(option.labelKey) }}</span>
            </label>
          </fieldset>
          <template v-else>
            <fieldset class="report-options-group">
              <legend>{{ t('reportSections') }}</legend>
              <label class="report-option">
                <input v-model="reportOptions.includeSummary" type="checkbox" />
                <span>{{ t('reportIncludeSummary') }}</span>
              </label>
            </fieldset>
            <fieldset class="report-options-group">
              <legend>{{ t('reportColumns') }}</legend>
              <label v-for="option in batchReportOptions" :key="option.key" class="report-option">
                <input v-model="reportOptions[option.key]" type="checkbox" />
                <span>{{ t(option.labelKey) }}</span>
              </label>
            </fieldset>
          </template>
          <p v-if="!hasSelectedReportContent" class="report-options-hint">{{ t('noReportSectionsSelected') }}</p>
        </div>
        <div class="report-dialog-actions">
          <button class="refresh-btn" @click="cancelReportOptions">{{ t('cancel') }}</button>
          <button class="action-btn download" :disabled="!hasSelectedReportContent" @click="generateSelectedReport">
            {{ t('generatePdf') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useLanguage } from '../store/language'
import { db } from '../firebase'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLanguage()

// State
const viewMode = ref('grid')
const searchQuery = ref('')
const activeFilters = ref({
  status: [] // 'healthy', 'infected'
})
const activeDateRange = ref('all')
const sortBy = ref('date-desc')
const selectedItem = ref(null)
const showReportOptions = ref(false)
const reportRequest = ref({ mode: 'single', items: [], returnToDetails: false })
const reportOptions = reactive({
  includeImage: true,
  includeFileInfo: true,
  includeResults: true,
  includeSymptoms: true,
  includeRecommendations: true,
  includeSummary: true,
  includeFilename: true,
  includeStatus: true,
  includeDisease: true,
  includeConfidence: true,
  includeDate: true
})
const singleReportOptions = [
  { key: 'includeImage', labelKey: 'reportIncludeImage' },
  { key: 'includeFileInfo', labelKey: 'reportIncludeFileInfo' },
  { key: 'includeResults', labelKey: 'reportIncludeResults' },
  { key: 'includeSymptoms', labelKey: 'reportIncludeSymptoms' },
  { key: 'includeRecommendations', labelKey: 'reportIncludeRecommendations' }
]
const availableSingleReportOptions = computed(() => singleReportOptions.filter(option => (
  option.key !== 'includeImage' || Boolean(reportRequest.value.items[0]?.image)
)))
const batchReportOptions = [
  { key: 'includeFilename', labelKey: 'reportIncludeFilename' },
  { key: 'includeStatus', labelKey: 'reportIncludeStatus' },
  { key: 'includeDisease', labelKey: 'reportIncludeDisease' },
  { key: 'includeConfidence', labelKey: 'reportIncludeConfidence' },
  { key: 'includeDate', labelKey: 'reportIncludeDate' }
]
const hasSelectedReportContent = computed(() => {
  const options = reportRequest.value.mode === 'single'
    ? availableSingleReportOptions.value
    : [{ key: 'includeSummary' }, ...batchReportOptions]
  return options.some(option => reportOptions[option.key])
})
const loading = ref(true)
const history = ref([]) // Will store ALL data from Firebase

// Filters and constants
const statusFilters = ref([
  { id: 'healthy', labelKey: 'healthy', color: '#10b981' },
  { id: 'infected', labelKey: 'infected', color: '#ef4444' },
  { id: 'pest', labelKey: 'pest', color: '#f59e0b' }
])

const dateRanges = ref([
  { id: 'today', labelKey: 'today' },
  { id: 'week', labelKey: 'thisWeek' },
  { id: 'month', labelKey: 'thisMonth' },
  { id: 'all', labelKey: 'allTime' }
])

const openReportOptions = (items, mode) => {
  reportRequest.value = {
    mode,
    items: [...items],
    returnToDetails: Boolean(selectedItem.value)
  }
  selectedItem.value = null
  showReportOptions.value = true
}

const cancelReportOptions = () => {
  showReportOptions.value = false
  if (reportRequest.value.returnToDetails) {
    selectedItem.value = reportRequest.value.items[0] || null
  }
}

const generateSelectedReport = async () => {
  const { mode, items } = reportRequest.value
  showReportOptions.value = false
  if (mode === 'single') {
    await generateSingleReport(items[0], { ...reportOptions })
  } else {
    await generateBatchReport(items, { ...reportOptions })
  }
}

// Computed properties
const healthyCount = computed(() => {
  return history.value.filter(item => item.status === 'healthy').length
})

const infectedCount = computed(() => {
  return history.value.filter(item => item.status === 'infected').length
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         activeFilters.value.status.length > 0 || 
         activeDateRange.value !== 'all'
})

// Show ALL filtered data, no pagination
const filteredHistory = computed(() => {
  let filtered = [...history.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.filename?.toLowerCase().includes(query) ||
      (item.disease && item.disease.toLowerCase().includes(query)) ||
      item.status?.toLowerCase().includes(query) ||
      (item.symptoms && item.symptoms.some(s => 
        s && typeof s === 'string' && s.toLowerCase().includes(query)
      ))
    )
  }

  // Apply status filters
  if (activeFilters.value.status.length > 0) {
    filtered = filtered.filter(item => 
      activeFilters.value.status.includes(item.status)
    )
  }

  // Apply date range filter
  if (activeDateRange.value !== 'all') {
    const now = new Date()
    let startDate = new Date()

    switch (activeDateRange.value) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    filtered = filtered.filter(item => {
      if (!item.uploadedAt) return false
      const itemDate = item.uploadedAt instanceof Date ? item.uploadedAt : new Date(item.uploadedAt)
      return itemDate >= startDate
    })
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aDate = a.uploadedAt instanceof Date ? a.uploadedAt : new Date(a.uploadedAt || 0)
    const bDate = b.uploadedAt instanceof Date ? b.uploadedAt : new Date(b.uploadedAt || 0)
    
    switch (sortBy.value) {
      case 'date-desc':
        return bDate - aDate
      case 'date-asc':
        return aDate - bDate
      case 'confidence-desc':
        return (b.confidence || 0) - (a.confidence || 0)
      case 'confidence-asc':
        return (a.confidence || 0) - (b.confidence || 0)
      case 'name-asc':
        return (a.filename || '').localeCompare(b.filename || '')
      case 'name-desc':
        return (b.filename || '').localeCompare(a.filename || '')
      default:
        return 0
    }
  })

  return filtered
})

// Display all data (no pagination)
const displayHistory = computed(() => {
  return filteredHistory.value
})

// Load ALL data from Firebase
const loadUserHistory = async () => {
  try {
    loading.value = true
    const userId = authStore.user?.uid
    
    if (!userId) {
      console.error('No user logged in')
      loading.value = false
      return
    }

    console.log('🔄 Loading history for user:', userId)

    // Query ALL user uploads from Firestore
    const uploadsRef = collection(db, 'uploads')
    
    // Try multiple queries to get all possible data
    let queries = []
    
    // Query 1: By userId
    queries.push(
      query(
        uploadsRef,
        where('userId', '==', userId)
      )
    )
    
    // Query 2: By userEmail (backward compatibility)
    const userEmail = authStore.user?.email
    if (userEmail) {
      queries.push(
        query(
          uploadsRef,
          where('userEmail', '==', userEmail)
        )
      )
    }
    
    // Execute all queries
    const snapshots = await Promise.all(
      queries.map(q => getDocs(q).catch(err => {
        console.error('Query error:', err)
        return { empty: true, forEach: () => {} }
      }))
    )
    
    const uploads = []
    const processedIds = new Set()
    
    // Process all snapshots
    snapshots.forEach((snapshot, index) => {
      if (snapshot.empty) return
      
      snapshot.forEach((doc) => {
        if (processedIds.has(doc.id)) return // Skip duplicates
        
        const data = doc.data()
        console.log(`📄 Processing document ${doc.id}:`, data)
        
        // Format for display
        const formattedItem = formatDocument(doc.id, data, 'uploads')
        if (formattedItem) {
          uploads.push(formattedItem)
          processedIds.add(doc.id)
        }
      })
    })

    const pestScansRef = collection(db, 'pestScans')
    const pestQueries = [query(pestScansRef, where('userId', '==', userId))]
    if (userEmail) {
      pestQueries.push(query(pestScansRef, where('userEmail', '==', userEmail)))
    }
    const pestSnapshots = await Promise.all(
      pestQueries.map(q => getDocs(q).catch(error => {
        console.error('Pest history query error:', error)
        return { empty: true, forEach: () => {} }
      }))
    )

    pestSnapshots.forEach(snapshot => {
      if (snapshot.empty) return
      snapshot.forEach(pestDoc => {
        const recordKey = `pestScans:${pestDoc.id}`
        if (processedIds.has(recordKey)) return

        const formattedItem = formatDocument(pestDoc.id, pestDoc.data(), 'pestScans')
        if (formattedItem) {
          uploads.push(formattedItem)
          processedIds.add(recordKey)
        }
      })
    })
    
    // Sort by date (newest first)
    uploads.sort((a, b) => {
      const aDate = a.uploadedAt instanceof Date ? a.uploadedAt : new Date(a.uploadedAt || 0)
      const bDate = b.uploadedAt instanceof Date ? b.uploadedAt : new Date(b.uploadedAt || 0)
      return bDate - aDate
    })
    
    history.value = uploads
    console.log(`✅ Loaded ${uploads.length} analyses from Firebase`)
    
  } catch (error) {
    console.error('❌ Error loading history from Firebase:', error)
    // Fallback to empty array
    history.value = []
  } finally {
    loading.value = false
  }
}

// Helper function to format document
const formatDocument = (id, data, collectionName = 'uploads') => {
  try {
    const filename = data.fileName || data.filename || `analysis_${id.substring(0, 8)}`
    const isPestScan = collectionName === 'pestScans' || data.scanType === 'pest'
    const displayResult = isPestScan ? data.pest : data.disease

    // Get status (handle different field names)
    let status = isPestScan ? 'pest' : 'unknown'
    if (!isPestScan) {
      if (data.status) status = data.status.toLowerCase()
      else if (data.result) status = data.result.toLowerCase()
      else if (data.disease === 'healthy') status = 'healthy'
      else if (data.disease && data.disease !== 'healthy') status = 'infected'
    }
    
    // Get confidence (handle different formats)
    let confidence = 0
    if (typeof data.confidence === 'number') {
      // Check if it's already a percentage (> 1) or a decimal (< 1)
      if (data.confidence > 1) {
        // Already a percentage (e.g., 85)
        confidence = Math.round(data.confidence)
      } else {
        // It's a decimal (e.g., 0.85), convert to percentage
        confidence = Math.round(data.confidence * 100)
      }
    } else if (typeof data.confidence === 'string') {
      const parsed = parseFloat(data.confidence)
      if (!isNaN(parsed)) {
        if (parsed > 1) {
          confidence = Math.round(parsed)
        } else {
          confidence = Math.round(parsed * 100)
        }
      }
    }
    
    // Get image
    let image = data.imageUrl || data.imageData || data.image
    if (!image) image = ''
    
    // Get timestamp
    let uploadedAt = new Date()
    if (data.timestamp instanceof Timestamp) {
      uploadedAt = data.timestamp.toDate()
    } else if (data.timestamp) {
      uploadedAt = new Date(data.timestamp)
    } else if (data.processedAt) {
      uploadedAt = new Date(data.processedAt)
    } else if (data.createdAt) {
      uploadedAt = new Date(data.createdAt)
    } else if (data.uploadedAt) {
      uploadedAt = new Date(data.uploadedAt)
    }
    
    return {
      id: isPestScan ? `pest-${id}` : id,
      firestoreId: id,
      collectionName,
      recordType: isPestScan ? 'pest' : 'disease',
      filename,
      fileSize: data.fileSize || 0,
      image: image,
      status: status,
      confidence: confidence,
      disease: formatDiseaseName(displayResult),
      symptoms: data.symptoms || (isPestScan ? [] : getSymptomsForDisease(data.disease)),
      recommendations: data.recommendations || (isPestScan ? [] : getRecommendationsForDisease(data.disease)),
      uploadedAt: uploadedAt,
      processingTime: data.processingTime || 2.5,
      originalData: data
    }
  } catch (error) {
    console.error('Error formatting document:', error, data)
    return null
  }
}

// Helper functions
const formatDiseaseName = (disease) => {
  if (!disease || disease === 'healthy') return t('healthy')
  
  // Convert snake_case to Proper Case
  return disease
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const getSymptomsForDisease = (disease) => {
  const symptomsMap = {
    healthy: ['Normal leaf coloration', 'No visible lesions', 'Proper leaf shape'],
    angular_leaf_spot: ['Angular water-soaked spots', 'Yellow halos around lesions', 'Leaf wilting'],
    downy_mildew: ['Yellow angular spots', 'Purple mold on underside', 'Leaf curling'],
    anthracnose: ['Brown sunken lesions', 'Pink spore masses', 'Fruit rot'],
    powdery_mildew: ['White powdery coating', 'Leaf yellowing', 'Stunted growth'],
    bacterial_wilt: ['Sudden wilting', 'Ooze from stems', 'Leaf discoloration']
  }
  
  return symptomsMap[disease] || ['Abnormal leaf appearance', 'Discoloration present']
}

const getRecommendationsForDisease = (disease) => {
  const recommendationsMap = {
    healthy: [
      'Continue regular watering schedule',
      'Maintain optimal sunlight exposure',
      'Monitor for any changes weekly'
    ],
    angular_leaf_spot: [
      'Remove infected leaves immediately',
      'Apply copper-based fungicide',
      'Improve air circulation around plants'
    ],
    downy_mildew: [
      'Apply fungicide containing metalaxyl',
      'Reduce leaf wetness duration',
      'Remove severely infected plants'
    ],
    anthracnose: [
      'Apply chlorothalonil fungicide',
      'Practice crop rotation',
      'Remove plant debris from field'
    ],
    powdery_mildew: [
      'Apply sulfur or potassium bicarbonate',
      'Increase air circulation',
      'Avoid overhead watering'
    ],
    bacterial_wilt: [
      'Remove and destroy infected plants',
      'Control cucumber beetles',
      'Use disease-free seeds'
    ]
  }
  
  return recommendationsMap[disease] || [
    'Consult with agricultural expert',
    'Isolate affected plants',
    'Apply appropriate treatment'
  ]
}

// Filter methods
const getStatusCount = (status) => {
  return history.value.filter(item => item.status === status).length
}

const toggleStatusFilter = (status) => {
  const index = activeFilters.value.status.indexOf(status)
  if (index > -1) {
    activeFilters.value.status.splice(index, 1)
  } else {
    activeFilters.value.status.push(status)
  }
}

const setDateRange = (range) => {
  activeDateRange.value = range
}

const clearFilters = () => {
  searchQuery.value = ''
  activeFilters.value.status = []
  activeDateRange.value = 'all'
}

// Formatting methods
const formatFilename = (filename) => {
  if (!filename) return t('unknown')
  if (filename.length > 20) {
    return filename.substring(0, 17) + '...'
  }
  return filename
}

const formatDate = (date) => {
  if (!date) return t('unknown')
  
  try {
    const now = new Date()
    const itemDate = date instanceof Date ? date : new Date(date)
    
    // Check if date is valid
    if (isNaN(itemDate.getTime())) {
      return t('invalidDate')
    }
    
    const diffMs = now - itemDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return t('minutesAgo', { count: diffMins })
    } else if (diffHours < 24) {
      return t('hoursAgo', { count: diffHours })
    } else if (diffDays < 7) {
      return t('daysAgo', { count: diffDays })
    } else {
      const options = { month: 'short', day: 'numeric' }
      if (diffDays > 365) {
        options.year = 'numeric'
      }
      return itemDate.toLocaleDateString(t('locale'), options)
    }
  } catch (error) {
    console.error('Error formatting date:', error, date)
    return t('invalidDate')
  }
}

const formatTime = (date) => {
  if (!date) return t('unknown')
  try {
    const itemDate = date instanceof Date ? date : new Date(date)
    if (isNaN(itemDate.getTime())) {
      return t('invalidTime')
    }
    return itemDate.toLocaleTimeString(t('locale'), { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch (error) {
    console.error('Error formatting time:', error, date)
    return t('invalidTime')
  }
}

const formatFullDate = (date) => {
  if (!date) return t('unknown')
  try {
    const itemDate = date instanceof Date ? date : new Date(date)
    if (isNaN(itemDate.getTime())) {
      return t('invalidDate')
    }
    return itemDate.toLocaleDateString(t('locale'), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting full date:', error, date)
    return t('invalidDate')
  }
}

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return `0 ${t('bytes')}`
  try {
    const k = 1024
    const sizes = [t('bytes'), 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  } catch (error) {
    return t('unknownSize')
  }
}

// PDF Report Generation
const downloadReport = (item) => openReportOptions([item], 'single')

const generateSingleReport = async (item, options) => {
  try {
    // Show loading state (optional)
    console.log('Generating PDF report...')
    
    // Create new PDF document
    const doc = new jsPDF()
    
    // Set document properties
    doc.setProperties({
      title: `${t('reportTitle')} - ${item.filename}`,
      subject: t('analysisResults'),
      author: t('appName'),
      keywords: 'cucumber, disease, analysis'
    })
    
    // Add header with logo/icon
    doc.setFillColor(16, 185, 129) // #10b981 color
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(t('reportTitle'), 14, 25)
    
    // Reset text color for rest of document
    doc.setTextColor(0, 0, 0)
    
    // Report metadata
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139) // #64748b color
    doc.text(`${t('reportDateGenerated')}: ${new Date().toLocaleString(t('locale'))}`, 14, 50)
    doc.text(`${t('analysisId')}: ${item.id}`, 14, 58)
    
    // Add image if available
    let yPos = 70
    
    if (options.includeImage && item.image) {
      try {
        // Add image to PDF
        const imgWidth = 100
        const imgHeight = 100
        doc.addImage(item.image, 'JPEG', 14, yPos, imgWidth, imgHeight)
        yPos += imgHeight + 10
      } catch (imgError) {
        console.warn('Could not add image to PDF:', imgError)
        // Continue without image
      }
    }
    
    if (options.includeFileInfo) {
      autoTable(doc, {
        startY: yPos,
        head: [[t('fileInformation'), '']],
        body: [
          [t('filename'), item.filename],
          [t('fileSize'), formatFileSize(item.fileSize)],
          [t('uploadDate'), formatFullDate(item.uploadedAt)],
          [t('processingTime'), `${item.processingTime || 2.5} ${t('seconds')}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 80 } }
      })
      yPos = doc.lastAutoTable.finalY + 10
    }
    
    if (options.includeResults) {
      autoTable(doc, {
        startY: yPos,
        head: [[t('analysisResults'), '']],
        body: [
          [t('status'), item.recordType === 'pest' ? t('pest') : item.status === 'healthy' ? t('healthy') : t('infected')],
          [t('confidence'), `${item.confidence}%`],
          [t(item.recordType === 'pest' ? 'detectedPest' : 'detectedDisease'), item.disease || t('none')]
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 80 } }
      })
      yPos = doc.lastAutoTable.finalY + 10
    }
    
    // Symptoms Table
    if (options.includeSymptoms && item.symptoms && item.symptoms.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [[t('symptomsIdentified')]],
        body: item.symptoms.map(symptom => [symptom]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' }
      })
      yPos = doc.lastAutoTable.finalY + 10
    }
    
    // Recommendations Table
    if (options.includeRecommendations && item.recommendations && item.recommendations.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [[t('recommendations')]],
        body: item.recommendations.map(rec => [rec]),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' }
      })
    }
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
      doc.text(
        t('appName'),
        14,
        doc.internal.pageSize.height - 10
      )
      doc.text(
        new Date().toLocaleDateString(t('locale')),
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      )
    }
    
    // Save the PDF
    const fileName = `cucumber_analysis_${item.id || Date.now()}.pdf`
    doc.save(fileName)
    
    console.log('✅ PDF report downloaded successfully')
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert(t('pdfFailed'))
  }
}

// Batch PDF Report Generation
const downloadBatchReport = (items) => openReportOptions(items, 'batch')

const generateBatchReport = async (items, options) => {
  if (!items || items.length === 0) return
  
  try {
    const doc = new jsPDF()
    
    // Title
    doc.setFillColor(16, 185, 129)
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(t('batchReportTitle'), 14, 25)
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text(`${t('reportDateGenerated')}: ${new Date().toLocaleString(t('locale'))}`, 14, 50)
    doc.text(`${t('totalAnalyses')}: ${items.length}`, 14, 58)
    
    let tableStartY = 70

    // Summary statistics
    const healthyCount = items.filter(i => i.status === 'healthy').length
    const infectedCount = items.filter(i => i.status === 'infected').length
    const pestCount = items.filter(i => i.recordType === 'pest').length

    if (options.includeSummary) {
      autoTable(doc, {
        startY: tableStartY,
        head: [[t('reportSummary'), '']],
        body: [
          [t('totalImages'), items.length],
          [t('healthyPlants'), healthyCount],
          [t('infectedPlants'), infectedCount],
          [t('pestScansCount'), pestCount]
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }
      })
      tableStartY = doc.lastAutoTable.finalY + 10
    }

    const columns = [
      {
        key: 'includeFilename',
        label: t('filename'),
        value: item => {
          const filename = item.filename || t('unknown')
          return filename.substring(0, 20) + (filename.length > 20 ? '...' : '')
        }
      },
      {
        key: 'includeStatus',
        label: t('status'),
        value: item => item.recordType === 'pest' ? t('pest') : item.status === 'healthy' ? t('healthy') : t('infected')
      },
      { key: 'includeDisease', label: t('pestOrDisease'), value: item => item.disease || t('none') },
      { key: 'includeConfidence', label: t('confidence'), value: item => `${item.confidence}%` },
      { key: 'includeDate', label: t('date'), value: item => formatDate(item.uploadedAt) }
    ].filter(column => options[column.key])

    if (columns.length > 0) {
      autoTable(doc, {
        startY: tableStartY,
        head: [columns.map(column => column.label)],
        body: items.map(item => columns.map(column => column.value(item))),
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }
      })
    }
    
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
      doc.text(
        t('appName'),
        14,
        doc.internal.pageSize.height - 10
      )
    }
    
    doc.save(`batch_analysis_${Date.now()}.pdf`)
    
  } catch (error) {
    console.error('Error generating batch PDF:', error)
    alert(t('batchPdfFailed'))
  }
}

// Action methods
const viewDetails = (item) => {
  selectedItem.value = item
}

const closeModal = () => {
  selectedItem.value = null
}

// Real delete from Firebase
const deleteItem = async (item) => {
  if (confirm(t('deleteAnalysisConfirm'))) {
    try {
      // Delete from Firebase
      await deleteDoc(doc(db, item.collectionName || 'uploads', item.firestoreId || item.id))
      
      // Remove from local state
      const index = history.value.findIndex(h => h.id === item.id)
      if (index > -1) {
        history.value.splice(index, 1)
      }
      
      closeModal()
      alert(t('analysisDeleted'))
      
    } catch (error) {
      console.error('Error deleting document:', error)
      alert(t('deleteFailed'))
    }
  }
}

// Reanalyze - navigate to upload
const reanalyzeItem = (item) => {
  // Store the image in localStorage for reanalysis
  if (item.image) {
    localStorage.setItem('reanalyzeImage', item.image)
  }
  router.push({
    path: '/upload',
    query: { 
      reanalyzeId: item.id,
      filename: item.filename 
    }
  })
}

const goToUpload = () => {
  router.push('/upload')
}

// Refresh data
const refreshData = () => {
  loadUserHistory()
}

// Lifecycle
onMounted(() => {
  loadUserHistory()
})

// Watch for auth changes
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    loadUserHistory()
  } else {
    history.value = []
  }
}, { immediate: true })
</script>

<style scoped>
/* Add this new style for batch download button */
.batch-download {
  background: rgba(245, 158, 11, 0.1) !important;
  color: #f59e0b !important;
  border-color: rgba(245, 158, 11, 0.2) !important;
}

.batch-download:hover {
  background: rgba(245, 158, 11, 0.2) !important;
}

/* Rest of your existing styles remain exactly the same */
.history-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
  margin-top: 10px;
}

/* Header */
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.history-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.history-subtitle {
  color: #64748b;
  font-size: 1.125rem;
  margin-bottom: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.2);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 180px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.healthy {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-icon.infected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-icon.total {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 4px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 24px;
  background: white;
  border-radius: 16px;
  margin: 20px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.loading-spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #64748b;
  font-size: 1.125rem;
  font-weight: 500;
}

/* Controls */
.history-controls {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  margin-bottom: 24px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-weight: 600;
  color: #475569;
  min-width: 80px;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  background: white;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.filter-chip.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.filter-chip.clear {
  background: rgba(100, 116, 139, 0.1);
  border-color: rgba(100, 116, 139, 0.2);
  color: #64748b;
}

.filter-chip.clear:hover {
  background: rgba(100, 116, 139, 0.2);
  border-color: rgba(100, 116, 139, 0.3);
}

.chip-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
}

.date-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.date-filter {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-filter:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.date-filter.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-weight: 600;
  color: #475569;
}

.sort-select {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 150px;
}

.sort-select:focus {
  outline: none;
  border-color: #10b981;
}

/* Results Summary */
.results-summary {
  background: #f8fafc;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.results-summary p {
  color: #475569;
  font-size: 0.875rem;
  margin: 0;
}

.filter-notice {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  margin-left: 8px;
}

/* View Toggle */
.view-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: none;
  color: #64748b;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: rgba(16, 185, 129, 0.05);
  color: #10b981;
}

.view-btn.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.view-btn svg {
  width: 20px;
  height: 20px;
}

/* History Grid */
.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.history-grid::-webkit-scrollbar {
  width: 6px;
}

.history-grid::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.history-grid::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.history-grid::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.history-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.history-card.healthy {
  border-top: 4px solid #10b981;
}

.history-card.infected {
  border-top: 4px solid #ef4444;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.history-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.history-card:hover .history-image {
  transform: scale(1.05);
}

.image-empty {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-card:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.overlay-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.card-content {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.card-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-status.healthy {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.card-status.infected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.info-text {
  font-size: 0.875rem;
  color: #64748b;
}

.card-disease {
  margin-bottom: 16px;
}

.disease-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.disease-name {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}

.card-confidence {
  margin-bottom: 20px;
}

.confidence-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #64748b;
}

.confidence-value {
  font-weight: 600;
  color: #1e293b;
}

.confidence-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

.confidence-fill.healthy {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.confidence-fill.infected {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.view {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-btn.view:hover {
  background: rgba(59, 130, 246, 0.2);
}

.action-btn.download {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.action-btn.download:hover {
  background: rgba(16, 185, 129, 0.2);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* History Table */
.history-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  max-height: 70vh;
  overflow-y: auto;
}

.history-table::-webkit-scrollbar {
  width: 6px;
}

.history-table::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.history-table::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.history-table::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

thead {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

td {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:hover {
  background: #f8fafc;
}

/* Table Cells */
.image-cell {
  width: 60px;
}

.table-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.filename-cell {
  min-width: 150px;
  max-width: 200px;
}

.filename {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.75rem;
  color: #94a3b8;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.healthy {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.infected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.disease-cell {
  min-width: 150px;
}

.disease-name {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.confidence-cell {
  min-width: 120px;
}

.confidence-progress {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.confidence-track {
  height: 100%;
  border-radius: 4px;
}

.confidence-track.healthy {
  background: #10b981;
}

.confidence-track.infected {
  background: #ef4444;
}

.confidence-percent {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.date-cell {
  min-width: 120px;
}

.date {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.table-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.table-btn.view {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.table-btn.view:hover {
  background: rgba(59, 130, 246, 0.2);
}

.table-btn.download {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.table-btn.download:hover {
  background: rgba(16, 185, 129, 0.2);
}

.table-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.table-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.table-btn svg {
  width: 18px;
  height: 18px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #cbd5e1;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.upload-btn svg {
  width: 20px;
  height: 20px;
}

.clear-filters-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 12px;
}

.clear-filters-btn:hover {
  background: rgba(100, 116, 139, 0.2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.report-options-dialog {
  max-width: 560px;
}

.report-options-dialog .modal-header {
  padding: 18px 24px;
}

.report-options-dialog .modal-header h3 {
  font-size: 1.2rem;
}

.report-options-body {
  max-height: 65vh;
  overflow-y: auto;
  padding: 20px 24px 4px;
}

.report-options-body > p:first-child {
  margin: 0 0 18px;
  color: #52645b;
  font-size: .9rem;
}

.report-options-group {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 0;
  margin: 0 0 18px;
  border: 0;
}

.report-options-group legend {
  grid-column: 1 / -1;
  padding: 0;
  margin-bottom: 8px;
  color: #263a30;
  font-size: .82rem;
  font-weight: 750;
}

.report-option {
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  color: #34483e;
  border: 1px solid #dce8e1;
  border-radius: 7px;
  font-size: .84rem;
  cursor: pointer;
}

.report-option input {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  accent-color: #13845f;
}

.report-options-hint {
  margin: 0 0 12px;
  color: #a43b3b;
  font-size: .82rem;
}

.report-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px 20px;
}

.report-dialog-actions button:disabled {
  cursor: not-allowed;
  opacity: .5;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
}

.modal-body {
  padding: 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.detail-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.875rem;
  color: #64748b;
}

.info-value {
  font-weight: 500;
  color: #1e293b;
  word-break: break-all;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-label {
  font-size: 0.875rem;
  color: #64748b;
}

.result-value {
  font-weight: 500;
  color: #1e293b;
}

.result-value.healthy {
  color: #10b981;
}

.result-value.infected {
  color: #ef4444;
}

.symptoms-list,
.recommendations-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.symptoms-list li {
  padding: 8px 0;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.symptoms-list li:last-child {
  border-bottom: none;
}

.recommendations-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.recommendations-list li:last-child {
  border-bottom: none;
}

.recommendations-list svg {
  width: 20px;
  height: 20px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.modal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.download {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.modal-btn.download:hover {
  background: rgba(16, 185, 129, 0.2);
}

.modal-btn.reanalyze {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.modal-btn.reanalyze:hover {
  background: rgba(245, 158, 11, 0.2);
}

.modal-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-stats {
    flex-direction: column;
  }
  
  .stat-card {
    min-width: 200px;
  }
}

@media (max-width: 1024px) {
  .modal-body {
    grid-template-columns: 1fr;
  }
  
  .history-header {
    flex-direction: column;
    gap: 24px;
  }
  
  .header-stats {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .stat-card {
    flex: 1;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .history-container {
    padding: 16px;
  }
  
  .history-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-stats {
    flex-direction: column;
  }
  
  .stat-card {
    width: 100%;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .view-toggle {
    bottom: 16px;
    right: 16px;
  }
}

@media (max-width: 640px) {
  .history-table {
    overflow-x: auto;
  }
  
  table {
    min-width: 600px;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .modal-content {
    padding: 0;
    margin: 10px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-btn {
    padding: 10px;
    font-size: 0.875rem;
  }
}
</style>