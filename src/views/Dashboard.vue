<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-top">
        <div class="header-left">
          <div class="welcome-section">
            <h1 class="welcome-title">
              <span class="greeting">{{ t('welcomeBack') }},</span>
              <span class="username">{{ userName || 'Farmer' }}</span>
            </h1>
            <p class="welcome-subtitle">{{ t('dashboardSubtitle') }}</p>
          </div>
        </div>

        <div class="header-right">
          <!-- Date Display -->
          <div class="date-display">
            <div class="date-card">
              <div class="date-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="date-info">
                <span class="date-day">{{ currentDay }}</span>
                <span class="date-full">{{ currentDate }}</span>
              </div>
            </div>
          </div>

          <!-- Notification Bell -->
            <div class="notification-bell" :class="{ active: showNotifications }" @click="toggleNotifications" @keydown.enter.prevent="toggleNotifications" @keydown.space.prevent="toggleNotifications" ref="notificationRef" role="button" tabindex="0" :aria-expanded="showNotifications" aria-haspopup="dialog" :aria-label="notificationCount ? t('notificationUnread', { count: notificationCount }) : t('notifications')">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>

            <!-- Notification Dropdown -->
            <div v-if="showNotifications" class="notification-dropdown" role="dialog" :aria-label="t('notifications')" @click.stop>
              <div class="dropdown-header">
                <div>
                  <h4>{{ t('notifications') }}</h4>
                  <p v-if="notificationCount" class="notification-summary">{{ t('notificationUpdates', { count: notificationCount }) }}</p>
                  <p v-else class="notification-summary">{{ t('allCaughtUp') }}</p>
                </div>
                <button @click.stop="markAllAsRead" class="mark-read" :disabled="notificationCount === 0">
                  {{ t('markAllRead') }}
                </button>
              </div>
              <div class="notification-list">
                <template v-if="unreadNotifications.length > 0">
                  <div v-for="notif in unreadNotifications" :key="notif.id" class="notification-item unread">
                    <div class="notif-icon" :class="notif.type">
                      <svg v-if="notif.type === 'success'" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else-if="notif.type === 'warning'" viewBox="0 0 24 24" fill="none">
                        <path d="M12 9V13M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5"/>
                      </svg>
                    </div>
                    <div class="notif-content">
                      <p class="notif-message">{{ notif.message }}</p>
                      <span class="notif-time">{{ notif.time }}</span>
                    </div>
                    <button class="notif-mark-read" @click.stop="markAsRead(notif.id)">✓</button>
                  </div>
                </template>
                <div v-else class="notification-empty">
                  <p>{{ t('noNewNotifications') }}</p>
                </div>
              </div>
              <div class="dropdown-footer">
                <button @click="viewAllNotifications">{{ t('viewAll') }}</button>
              </div>
            </div>
          </div>

          <!-- User Avatar with Dropdown -->
          <div class="user-avatar" @click="toggleUserMenu" ref="userMenuRef">
            <div class="avatar-initials">
              {{ userInitials }}
            </div>

            <!-- User Dropdown Menu -->
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="dropdown-item" @click="navigateToProfile">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ t('myProfile') }}</span>
              </div>
              <div class="dropdown-item" @click="openSettings">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M19.4 15L21 17.5L18.5 20L16 18.5L14 20L11.5 18.5L9 20L6.5 18.5L4 20L2 17.5L4 15L2.5 12L4 9L2 6.5L4.5 4L7 5.5L9 4L11.5 5.5L14 4L16.5 5.5L19 4L21 6.5L19 9L20.5 12L19.4 15Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>{{ t('settings') }}</span>
              </div>
              <div class="dropdown-item logout" @click="handleLogout">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ t('logout') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats Row -->
      <div class="quick-stats">
        <div class="quick-stat-item" @click="filterByType('total')">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ t('totalAnalyzed') }}</span>
            <span class="stat-value">{{ totalAnalyses.toLocaleString() }}</span>
          </div>
        </div>

        <div class="quick-stat-item" @click="filterByType('users')">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ t('healthyPlants') }}</span>
            <span class="stat-value">{{ healthyCount.toLocaleString() }}</span>
          </div>
        </div>

        <div class="quick-stat-item" @click="filterByType('success')">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ t('modelAccuracy') }}</span>
            <span class="stat-value">{{ accuracyPercent }}%</span>
          </div>
        </div>

        <div class="quick-stat-item" @click="filterByType('time')">
          <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5C21 16.1944 17.1944 20 12.5 20C7.80558 20 4 16.1944 4 11.5C4 6.80558 7.80558 3 12.5 3C17.1944 3 21 6.80558 21 11.5Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12.5 7V12L15.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">{{ t('avgProcessing') }}</span>
            <span class="stat-value">{{ averageProcessingTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <StatCard
        :number="totalAnalyses.toLocaleString()"
        :label="t('totalAnalyzed')"
        icon="📊"
        trend="+12%"
        color="gradient-blue"
        :loading="isLoading"
        @click="showDetailedStats('total')"
      />
      <StatCard
        :number="healthyCount.toLocaleString()"
        :label="t('healthyPlants')"
        icon="🌿"
        trend="+5.2%"
        color="gradient-green"
        :loading="isLoading"
        @click="showDetailedStats('healthy')"
      />
      <StatCard
        :number="infectedCount.toLocaleString()"
        :label="t('infectedPlants')"
        icon="⚠️"
        trend="-3.1%"
        color="gradient-orange"
        :loading="isLoading"
        @click="showDetailedStats('infected')"
      />
      <StatCard
        :number="`${accuracyPercent}%`"
        :label="t('modelAccuracy')"
        icon="🎯"
        trend="+0.8%"
        color="gradient-purple"
        :loading="isLoading"
        @click="showDetailedStats('accuracy')"
      />
    </div>

    <!-- System Status Card -->
    <div class="system-status-card">
      <div class="card-header">
        <div class="header-content">
          <svg class="status-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div>
            <h3 class="card-title">{{ t('systemStatus') }}</h3>
            <p class="card-subtitle">{{ t('liveMonitoring') }}</p>
          </div>
        </div>
        <div class="status-indicator" @click="refreshSystemStatus">
          <div class="indicator-dot" :class="{ 'online': isSystemOnline }"></div>
          <span class="status-text">{{ isSystemOnline ? t('online') : t('offline') }}</span>
        </div>
      </div>

      <div class="status-grid">
        <div class="status-item" @click="checkModelStatus">
          <div class="status-item-header">
            <svg class="item-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L9 18L4 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="item-label">{{ t('mlModel') }}</span>
          </div>
          <div class="item-value status-active">{{ t('operational') }}</div>
        </div>

        <div class="status-item" @click="checkLastUpdate">
          <div class="status-item-header">
            <svg class="item-icon" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="item-label">{{ t('lastUpdate') }}</span>
          </div>
          <div class="item-value">{{ lastAnalysisDate }}</div>
        </div>

        <div class="status-item" @click="checkQueue">
          <div class="status-item-header">
            <svg class="item-icon" viewBox="0 0 24 24" fill="none">
              <path d="M18 8L22 12L18 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M2 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="item-label">{{ t('queue') }}</span>
          </div>
          <div class="item-value queue-empty">{{ t('pending', { count: totalAnalyses }) }}</div>
        </div>

        <div class="status-item" @click="checkProcessingTime">
          <div class="status-item-header">
            <svg class="item-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="item-label">{{ t('avgProcessing') }}</span>
          </div>
          <div class="item-value">{{ averageProcessingTime }}</div>
        </div>
      </div>

      <!-- System Control Buttons -->
      <div class="system-controls">
        <button class="control-btn" @click="restartService" :disabled="!isSystemOnline">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M23 20V14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 14 3.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M3.51 15C4.0172 16.4332 4.87907 17.7146 6.01547 18.7246C7.15186 19.7346 8.52549 20.4402 10 20.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ t('restartService') }}
        </button>
        <button class="control-btn" @click="runDiagnostic">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 12V8H4V12M20 12V16H4V12M20 12H4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          {{ t('runDiagnostic') }}
        </button>
        <button class="control-btn" @click="viewLogs">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20V20H4V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 8H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 16H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ t('viewLogs') }}
        </button>
      </div>
    </div>

    <!-- Analytics Panel -->
    <AnalyticsPanel 
      :selected-time-range="selectedTimeRange"
      @time-range-change="handleTimeRangeChange"
      @export-data="exportAnalyticsData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '../store/language'
import { useAuthStore } from '../store/auth'
import { db } from '../firebase'
import { collection, query, where, getDocs, Timestamp, onSnapshot, orderBy } from 'firebase/firestore'
import AnalyticsPanel from '../components/AnalyticsPanel.vue'
import StatCard from '../components/StatCard.vue'

const router = useRouter()
const { t } = useLanguage()
const authStore = useAuthStore()

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Refs for dropdown menus
const notificationRef = ref(null)
const userMenuRef = ref(null)

// State
const userHistory = ref([])
const isDashboardLoading = ref(true)
const dashboardError = ref(null)
const animatedStats = ref([0, 0, 0, 0])
const isSystemOnline = ref(true)
const lastUpdate = ref('No analyses yet')
const avgProcessingTime = ref('0.0 seconds')
const showNotifications = ref(false)
const showUserMenu = ref(false)
const selectedTimeRange = ref('7D')
const animationTimer = ref(null)

// Notifications data
// Notifications are populated only from the live listener below.
const notifications = ref([])

const notificationCount = computed(() => notifications.value.filter(n => !n.read).length)
const unreadNotifications = computed(() => notifications.value.filter(n => !n.read))

let notificationsUnsub = null

// User data
const userName = computed(() => {
  return authStore.user?.displayName || authStore.user?.email?.split('@')[0] || t('farmer')
})

const userInitials = computed(() => {
  return userName.value
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const currentDate = computed(() => {
  const locale = t('locale') || 'en-US'
  return new Date().toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
})

const currentDay = computed(() => {
  const locale = t('locale') || 'en-US'
  return new Date().toLocaleDateString(locale, {
    weekday: 'long'
  })
})

const healthyCount = computed(() => {
  return userHistory.value.filter(item => item.status === 'healthy').length
})

const infectedCount = computed(() => {
  return userHistory.value.filter(item => item.status === 'infected').length
})

const totalAnalyses = computed(() => {
  return userHistory.value.length
})

const accuracyPercent = computed(() => {
  if (!userHistory.value.length) return 0
  const accurateItems = userHistory.value.filter(item => item.confidence >= 80).length
  return Math.round((accurateItems / userHistory.value.length) * 100)
})

const averageProcessingTime = computed(() => {
  if (!userHistory.value.length) return `0.0 ${t('seconds')}`
  const totalSeconds = userHistory.value.reduce((sum, item) => sum + (item.processingTime || 0), 0)
  const avg = totalSeconds / userHistory.value.length
  return `${avg.toFixed(1)} ${t('seconds')}`
})

const lastAnalysisDate = computed(() => {
  if (!userHistory.value.length) return 'No analyses yet'
  const mostRecent = [...userHistory.value].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0]
  return new Date(mostRecent.uploadedAt).toLocaleString()
})

// Toggle functions
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showUserMenu.value) showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showNotifications.value) showNotifications.value = false
}

// Notification functions
const markAsRead = (id) => {
  const notif = notifications.value.find(n => n.id === id)
  if (notif) {
    notif.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const viewAllNotifications = () => {
  router.push('/notifications')
  showNotifications.value = false
}

// User menu functions
const navigateToProfile = () => {
  router.push('/profile')
  showUserMenu.value = false
}

const openSettings = () => {
  router.push('/settings')
  showUserMenu.value = false
}

const handleLogout = async () => {
  try {
    showUserMenu.value = false
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Filter functions
const filterByType = (type) => {
  console.log(`Filtering by: ${type}`)
  // Implement filtering logic
  // You can emit an event or update a store
}

const showDetailedStats = (type) => {
  console.log(`Showing detailed stats for: ${type}`)
  // Navigate to detailed stats page or open modal
}

// System status functions
const refreshSystemStatus = () => {
  console.log('Refreshing system status...')
  if (userHistory.value.length === 0) {
    isSystemOnline.value = false
    return
  }
  isSystemOnline.value = true
}

const checkModelStatus = () => {
  console.log('Checking model status...')
  alert(t('modelStatusCheck'))
}

const checkLastUpdate = () => {
  console.log('Checking last update...')
  alert(`${t('lastUpdate')}: ${lastAnalysisDate.value}`)
}

const checkQueue = () => {
  console.log('Checking queue...')
  alert(`${t('pending', { count: totalAnalyses })}`)
}

const checkProcessingTime = () => {
  console.log('Checking processing time...')
  alert(`${t('avgProcessing')}: ${averageProcessingTime.value}`)
}

const formatHistoryItem = (data, id) => {
  const filename = data.fileName || data.filename || `analysis_${id?.slice(0, 8)}`
  let status = 'unknown'
  if (data.status) status = String(data.status).toLowerCase()
  else if (data.result) status = String(data.result).toLowerCase()
  else if (data.disease === 'healthy') status = 'healthy'
  else if (data.disease) status = 'infected'

  let confidence = 0
  if (typeof data.confidence === 'number') {
    confidence = data.confidence > 1 ? Math.round(data.confidence) : Math.round(data.confidence * 100)
  } else if (typeof data.confidence === 'string') {
    const parsed = parseFloat(data.confidence)
    if (!Number.isNaN(parsed)) {
      confidence = parsed > 1 ? Math.round(parsed) : Math.round(parsed * 100)
    }
  }

  let uploadedAt = new Date()
  if (data.timestamp instanceof Timestamp) {
    uploadedAt = data.timestamp.toDate()
  } else if (data.createdAt instanceof Timestamp) {
    uploadedAt = data.createdAt.toDate()
  } else if (data.uploadedAt instanceof Timestamp) {
    uploadedAt = data.uploadedAt.toDate()
  } else if (data.timestamp || data.createdAt || data.uploadedAt || data.processedAt) {
    uploadedAt = new Date(data.timestamp || data.createdAt || data.uploadedAt || data.processedAt)
  }

  return {
    id,
    filename,
    status,
    confidence,
    disease: data.disease || 'unknown',
    processingTime: Number(data.processingTime) || 0,
    uploadedAt,
    originalData: data
  }
}

const formatTimestamp = (value) => {
  if (!value) return 'Just now'
  const date = value?.toDate ? value.toDate() : new Date(value)
  return date.toLocaleString()
}

const setupNotificationsListener = async () => {
  try {
    await authStore.initializeAuth()
    const postsRef = collection(db, 'forumPosts')
    const q = query(postsRef, orderBy('createdAt', 'desc'))
    const seen = new Set()

    notificationsUnsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const post = { id: change.doc.id, ...change.doc.data() }
          // Ignore own posts
          if (post.authorId && post.authorId === authStore.user?.uid) return
          if (seen.has(post.id)) return
          seen.add(post.id)

          const text = (post.text || '').trim()
          const short = text.length > 120 ? text.slice(0, 120) + '…' : text
          const message = `${post.authorName || 'Someone'}: ${short || 'New post'}`

          notifications.value.unshift({
            id: `post_${post.id}`,
            type: 'info',
            message,
            time: formatTimestamp(post.createdAt),
            read: false,
            meta: { source: 'forum', postId: post.id }
          })

          notificationCount.value = notifications.value.filter(n => !n.read).length

          // Desktop notification (non-blocking)
          try {
            if (window.Notification && Notification.permission === 'granted') {
              new Notification('New forum post', { body: message })
            } else if (window.Notification && Notification.permission !== 'denied') {
              Notification.requestPermission().then(p => {
                if (p === 'granted') new Notification('New forum post', { body: message })
              })
            }
          } catch (e) {
            console.debug('Notification API unavailable', e)
          }
        }
      })
    }, (err) => console.error('Notifications listener error:', err))
  } catch (err) {
    console.error('Failed to setup notifications listener:', err)
  }
}

const loadUserHistory = async () => {
  dashboardError.value = null
  isDashboardLoading.value = true

  try {
    const userId = authStore.user?.uid
    const userEmail = authStore.user?.email

    if (!userId && !userEmail) {
      userHistory.value = []
      return
    }

    const uploadsRef = collection(db, 'uploads')
    const queries = []
    if (userId) {
      queries.push(query(uploadsRef, where('userId', '==', userId)))
      queries.push(query(uploadsRef, where('ownerUid', '==', userId)))
      queries.push(query(uploadsRef, where('uid', '==', userId)))
    }
    if (userEmail) {
      queries.push(query(uploadsRef, where('userEmail', '==', userEmail)))
      queries.push(query(uploadsRef, where('ownerEmail', '==', userEmail)))
      queries.push(query(uploadsRef, where('email', '==', userEmail)))
    }

    const snapshots = await Promise.all(
      queries.map(q => getDocs(q).catch(err => {
        console.error('Dashboard query error:', err)
        return { empty: true, forEach: () => {} }
      }))
    )

    const items = []
    const seen = new Set()
    snapshots.forEach(snapshot => {
      if (!snapshot || snapshot.empty) return
      snapshot.forEach(doc => {
        if (seen.has(doc.id)) return
        seen.add(doc.id)
        items.push(formatHistoryItem(doc.data(), doc.id))
      })
    })

    items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    userHistory.value = items
    lastUpdate.value = lastAnalysisDate.value
    avgProcessingTime.value = averageProcessingTime.value
    refreshSystemStatus()
  } catch (error) {
    console.error('Dashboard load error:', error)
    dashboardError.value = error.message || 'Unable to load dashboard data'
    userHistory.value = []
  } finally {
    isDashboardLoading.value = false
  }
}

// System control functions
const restartService = () => {
  if (confirm(t('confirmRestart'))) {
    console.log('Restarting service...')
    isSystemOnline.value = false
    setTimeout(() => {
      isSystemOnline.value = true
      alert(t('serviceRestarted'))
    }, 3000)
  }
}

const runDiagnostic = () => {
  console.log('Running diagnostic...')
  alert(t('diagnosticRunning'))
  // Implement diagnostic logic
}

const viewLogs = () => {
  console.log('Viewing logs...')
  router.push('/logs')
}

// Time range functions
const setTimeRange = (range) => {
  selectedTimeRange.value = range
  console.log(`Time range set to: ${range}`)
}

const handleTimeRangeChange = (range) => {
  selectedTimeRange.value = range
  // Update data based on time range
}

const exportAnalyticsData = () => {
  console.log('Exporting analytics data...')
  // Implement export logic
  alert(t('exportStarted'))
}

// Click outside handler
const handleClickOutside = (event) => {
  if (notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotifications.value = false
  }
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

// Animation for stats
onMounted(() => {
  const targets = [1247, 78, 22, 94.2]
  const interval = 30
  let steps = 60
  let counters = [0, 0, 0, 0]
  
  const timers = setInterval(() => {
    steps--
    if (steps <= 0) {
      animatedStats.value = targets.map(t => t)
      clearInterval(timers)
      return
    }
    counters = counters.map((c, i) => c + targets[i] / 60)
    animatedStats.value = counters.map((c, i) => 
      i === 3 ? Number(c.toFixed(1)) : Math.floor(c)
    )
  }, interval)

  document.addEventListener('click', handleClickOutside)

  loadUserHistory()
  setupNotificationsListener()

  return () => {
    clearInterval(timers)
    document.removeEventListener('click', handleClickOutside)
    if (notificationsUnsub) notificationsUnsub()
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(16, 185, 129, 0.14), transparent 28%),
              radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.10), transparent 38%),
              #f4f7f6;
  padding: 24px;
  position: relative;
  overflow-x: hidden;
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.12);
  position: relative;
  /* Let menus anchored inside the header extend beyond the card. */
  overflow: visible;
}

.dashboard-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #34d399, #10b981);
  background-size: 200% 100%;
  animation: gradientMove 3s ease infinite;
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}

.welcome-section {
  position: relative;
}

.welcome-title {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.greeting {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  margin-bottom: 6px;
}

.username {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.welcome-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.welcome-subtitle::before {
  content: '✨';
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.date-display {
  background: #f8fafc;
  border-radius: 18px;
  padding: 10px 18px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  cursor: pointer;
}

.date-display:hover {
  background: white;
  border-color: #10b981;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.08);
}

.date-card {
  display: flex;
  align-items: center;
  gap: 14px;
}

.date-icon {
  width: 38px;
  height: 38px;
  background: rgba(16, 185, 129, 0.12);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

.date-info {
  display: flex;
  flex-direction: column;
}

.date-day {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.date-full {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.notification-bell {
  position: relative;
  width: 46px;
  height: 46px;
  background: #f8fafc;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.notification-bell:hover {
  background: white;
  color: #10b981;
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(16, 185, 129, 0.08);
}

.notification-bell svg {
  width: 20px;
  height: 20px;
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 0.63rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid white;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 28px 50px rgba(15, 23, 42, 0.14);
  border: 1px solid #e2e8f0;
  margin-top: 8px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.dropdown-header h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.mark-read {
  background: none;
  border: none;
  color: #10b981;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.mark-read:hover {
  background: rgba(16, 185, 129, 0.12);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: rgba(16, 185, 129, 0.06);
}

.notification-empty {
  padding: 28px 16px;
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
}

.notif-icon.success {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.notif-icon.warning {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.notif-icon.info {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.notif-icon svg {
  width: 16px;
  height: 16px;
}

.notif-content {
  flex: 1;
}

.notif-message {
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 4px;
  line-height: 1.5;
}

.notif-time {
  font-size: 0.72rem;
  color: #94a3b8;
}

.notif-mark-read {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.notification-item:hover .notif-mark-read {
  opacity: 1;
}

.dropdown-footer {
  padding: 14px 16px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.dropdown-footer button {
  background: none;
  border: none;
  color: #10b981;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;
}

.dropdown-footer button:hover {
  color: #047857;
}

/* Refined notification panel */
.notification-bell {
  background: linear-gradient(145deg, #ffffff, #f4f8f6);
  border-color: #dbe8e1;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(15, 59, 42, 0.04);
  transition: color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}
.notification-bell.active { color: #07845e; background: #fff; border-color: #8bd6b7; box-shadow: 0 0 0 4px rgba(16,185,129,.12), 0 12px 28px rgba(15,98,69,.12); }
.notification-bell:focus-visible { outline: 3px solid rgba(16,185,129,.35); outline-offset: 3px; }
.notification-badge { background: linear-gradient(135deg, #fb5b63, #dc2626); box-shadow: 0 2px 7px rgba(220,38,38,.32); }
.notification-dropdown { width: min(380px, calc(100vw - 32px)); margin-top: 12px; background: rgba(255,255,255,.98); border-color: #dce9e2; border-radius: 20px; box-shadow: 0 24px 60px rgba(15,53,39,.2), 0 5px 16px rgba(15,23,42,.08); }
.dropdown-header { padding: 18px 18px 16px; border-bottom-color: #e6efe9; background: linear-gradient(135deg, #f5fbf7, #fbfdfc); }
.notification-summary { margin: 4px 0 0; color: #769084; font-size: .72rem; font-weight: 500; }
.mark-read { border-radius: 9px; transition: background .2s ease, color .2s ease; }
.mark-read:disabled { color: #a7b8af; cursor: not-allowed; }
.mark-read:disabled:hover { background: transparent; }
.notification-list { max-height: min(352px, 52vh); }
.notification-item { gap: 12px; padding: 15px 18px; border-bottom-color: #edf3ef; transition: background .2s ease, transform .2s ease; }
.notification-item:hover { background: #f7fbf8; }
.notification-item.unread { background: linear-gradient(90deg, rgba(16,185,129,.1), rgba(255,255,255,0)); }
.notification-item.unread::before { content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; background: #10b981; border-radius: 0 4px 4px 0; }
.notification-empty { padding: 38px 16px; }
.notif-icon { width: 36px; height: 36px; flex: 0 0 36px; display: grid; place-items: center; border-radius: 12px; }
.notif-content { min-width: 0; }
.notif-message { font-size: .84rem; }
.notif-mark-read { transition: opacity .15s ease, transform .15s ease; }
.notif-mark-read:focus-visible { opacity: 1; outline: 3px solid rgba(16,185,129,.28); outline-offset: 2px; }
.dropdown-footer { padding: 12px 16px; border-top-color: #e6efe9; background: #fbfdfc; }

.user-avatar {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: translateY(-1px);
}

.avatar-initials {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.32);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 28px 55px rgba(15, 23, 42, 0.16);
  border: 1px solid #e2e8f0;
  margin-top: 10px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  color: #334155;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(16, 185, 129, 0.08);
  color: #0f172a;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.quick-stat-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.quick-stat-item:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(16, 185, 129, 0.1);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.green {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.stat-icon.blue {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.stat-icon.purple {
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
}

.stat-icon.orange {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.stat-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.system-status-card {
  background: white;
  border-radius: 28px;
  padding: 34px;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.08);
  transition: transform 0.3s ease;
  margin-bottom: 32px;
}

.system-status-card:hover {
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 18px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 18px;
}

.status-icon {
  width: 50px;
  height: 50px;
  color: #10b981;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
}

.card-subtitle {
  font-size: 0.95rem;
  color: #64748b;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: #ecfdf5;
  border-radius: 32px;
  border: 1px solid #d1fae5;
  cursor: pointer;
  transition: background 0.2s ease;
}

.status-indicator:hover {
  background: #d1fae5;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s infinite;
}

.status-text {
  font-weight: 700;
  color: #16a34a;
  font-size: 0.9rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.status-item {
  background: #f8fafc;
  border-radius: 24px;
  padding: 22px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.status-item:hover {
  background: white;
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 16px 35px rgba(16, 185, 129, 0.1);
}

.status-item-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.item-icon {
  width: 24px;
  height: 24px;
  color: #8b5cf6;
  flex-shrink: 0;
}

.item-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.item-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  margin-left: auto;
}

.status-active {
  color: #10b981;
}

.queue-empty {
  color: #3b82f6;
}

.system-controls {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.control-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  color: #475569;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  background: white;
  border-color: #10b981;
  color: #0f172a;
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(16, 185, 129, 0.08);
}

.control-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.control-btn svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 1200px) {
  .status-grid,
  .quick-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .quick-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 18px;
  }

  .dashboard-header {
    padding: 26px;
  }

  .header-top {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
  }

  .header-right > * {
    min-width: 0;
  }

  .username {
    font-size: 1.65rem;
  }

  .stats-grid,
  .status-grid,
  .quick-stats {
    grid-template-columns: 1fr;
  }

  .system-controls {
    flex-direction: column;
    gap: 12px;
  }

  .notification-dropdown {
    width: min(380px, calc(100vw - 32px));
    right: 0;
    left: auto;
  }
}

@media (max-width: 767px) {
  .card-header {
    flex-direction: column;
    gap: 18px;
  }

  .status-indicator {
    align-self: flex-start;
  }

  .header-right {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .date-display {
    width: 100%;
  }

  .date-card {
    justify-content: center;
  }

  .notification-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    width: min(380px, calc(100vw - 32px));
    max-height: calc(100dvh - 48px);
    margin-top: 0;
    border-radius: 18px;
    transform: translate(-50%, -50%);
    z-index: 1201;
  }

  .dropdown-header { padding: 16px; }
  .notification-list { max-height: min(360px, calc(100dvh - 190px)); }
  .notification-item { padding: 14px 16px; }
  .notif-message { font-size: .82rem; }
  .notif-mark-read { opacity: 1; }
}
</style> 
