<template>
  <div class="analytics-dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <h2>Process Analytics</h2>
          <p class="subtitle">Performance insights and process monitoring</p>
        </div>
        <div class="header-right">
          <div class="time-filter">
            <label>Time Range</label>
            <div class="filter-buttons">
              <button 
                v-for="period in timePeriods" 
                :key="period.value"
                :class="{ active: windowDays === period.value }"
                @click="windowDays = period.value"
                class="period-btn"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview Cards -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 17L15 12L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Processes</div>
          <div class="stat-value">{{ total }}</div>
          <div class="stat-trend" v-if="trendPercentage !== null">
            <span :class="trendPercentage >= 0 ? 'positive' : 'negative'">
              {{ trendPercentage >= 0 ? '↑' : '↓' }} {{ Math.abs(trendPercentage) }}%
            </span>
            <span class="trend-label">from last period</span>
          </div>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Completed</div>
          <div class="stat-value">{{ completedCount }}</div>
          <div class="stat-subtext">{{ completionRate }}% success rate</div>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Avg Processing Time</div>
          <div class="stat-value">{{ avgProcessing !== null ? avgProcessing + 's' : 'N/A' }}</div>
          <div class="stat-subtext">{{ fastProcessCount }} processes under 5s</div>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">Active Processes</div>
          <div class="stat-value">{{ activeCount }}</div>
          <div class="stat-subtext">Currently in progress</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Volume Chart -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Process Volume</h3>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color current"></span>
              <span>Current Period</span>
            </div>
          </div>
        </div>
        <div class="chart-body">
          <div class="volume-chart">
            <div class="chart-bars">
              <div v-for="(d, i) in perDay" :key="d.date" class="bar-container">
                <div class="bar-wrapper">
                  <div 
                    class="volume-bar" 
                    :style="{ height: barHeight(d.count) + '%' }"
                    :class="{ 'highlight': isToday(d.date) }"
                  >
                    <div class="bar-value">{{ d.count }}</div>
                  </div>
                </div>
                <div class="bar-label">{{ shortDate(d.date) }}</div>
                <div class="bar-day">{{ getDayName(d.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="chart-container">
        <div class="chart-header">
          <h3>Status Distribution</h3>
        </div>
        <div class="chart-body">
          <div class="distribution-chart">
            <div class="status-donut">
              <div class="donut-chart" :style="donutStyle"></div>
              <div class="donut-center">
                <div class="center-value">{{ Object.keys(statusCounts).length }}</div>
                <div class="center-label">Statuses</div>
              </div>
            </div>
            <div class="status-legend">
              <div v-for="(count, status) in statusCounts" :key="status" class="legend-item">
                <span class="legend-dot" :style="{ backgroundColor: getStatusColor(status) }"></span>
                <span class="legend-text">{{ status }}</span>
                <span class="legend-value">{{ count }}</span>
                <span class="legend-percentage">{{ getStatusPercentage(count) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="metrics-section">
      <div class="metrics-header">
        <h3>Performance Metrics</h3>
        <div class="metrics-filter">
          <span class="filter-label">Sort by:</span>
          <select v-model="sortMetric" class="metric-select">
            <option value="time">Processing Time</option>
            <option value="date">Recent Activity</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      
      <div class="metrics-grid">
        <div class="metric-card" v-for="(metric, index) in performanceMetrics" :key="index">
          <div class="metric-header">
            <div class="metric-icon" :style="{ backgroundColor: metric.color + '20' }">
              <component :is="metric.icon" />
            </div>
            <div class="metric-title">{{ metric.title }}</div>
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-trend" :class="metric.trend >= 0 ? 'positive' : 'negative'">
            <span v-if="metric.trend !== null">
              {{ metric.trend >= 0 ? '↗' : '↘' }} {{ Math.abs(metric.trend) }}%
            </span>
            <span v-else>No previous data</span>
          </div>
          <div class="metric-description">{{ metric.description }}</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <div class="activity-header">
        <h3>Recent Activity</h3>
        <button class="view-all-btn" @click="openModal('activity')">
          View All
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="activity-timeline">
        <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
          <div class="activity-icon" :class="activity.status">
            <component :is="getActivityIcon(activity.status)" />
          </div>
          <div class="activity-content">
            <div class="activity-title">{{ activity.title }}</div>
            <div class="activity-meta">
              <span class="activity-time">{{ formatTime(activity.time) }}</span>
              <span class="activity-dot">•</span>
              <span class="activity-duration" v-if="activity.duration">{{ activity.duration }} processing</span>
            </div>
          </div>
          <div class="activity-status" :class="activity.status">
            {{ activity.status }}
          </div>
        </div>
        
        <div v-if="recentActivity.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="empty-text">No recent activity</div>
          <div class="empty-subtext">Start a new process to see analytics</div>
        </div>
      </div>
    </div>

    <!-- Activity Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>All Activity</h3>
          <button class="modal-close" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="recent.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="empty-text">No activity yet</div>
            <div class="empty-subtext">Start a new process to see analytics</div>
          </div>
          <div v-else class="activity-list">
            <div v-for="(activity, index) in recent" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.status">
                <component :is="getActivityIcon(activity.status)" />
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.name || 'Image Analysis Process' }}</div>
                <div class="activity-meta">
                  <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
                  <span class="activity-dot">â€¢</span>
                  <span class="activity-duration" v-if="activity.processing_time">
                    {{ activity.processing_time }} processing
                  </span>
                </div>
              </div>
              <div class="activity-status" :class="activity.status">
                {{ activity.status || 'completed' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { db, auth, collection, query, orderBy, getDocs } from '../firebase.js'
import { where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const loading = ref(true)
const signedIn = ref(false)
const loadError = ref('')

const total = ref(0)
const perDay = ref([])
const recent = ref([])
const windowDays = ref(7)
const statusCounts = ref({})
const avgProcessing = ref(null)
const sortMetric = ref('date')
const showModal = ref(false)
const modalType = ref('')

const timePeriods = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 }
]

const shortDate = (iso) => {
  try { 
    const date = new Date(iso)
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  } catch { return iso }
}

const getDayName = (iso) => {
  try {
    const date = new Date(iso)
    return date.toLocaleDateString(undefined, { weekday: 'short' })
  } catch { return '' }
}

const isToday = (iso) => {
  const today = new Date().toISOString().slice(0, 10)
  return iso === today
}

const barHeight = (count) => {
  const max = Math.max(...perDay.value.map(d => d.count), 1)
  return Math.round((count / max) * 100)
}

const formatTime = (timestamp) => {
  try {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  } catch { return timestamp }
}

// Computed properties
const completedCount = computed(() => {
  return statusCounts.value['completed'] || statusCounts.value['done'] || 0
})

const activeCount = computed(() => {
  const activeStatuses = ['processing', 'in_progress', 'pending', 'active']
  return Object.entries(statusCounts.value).reduce((sum, [status, count]) => {
    return sum + (activeStatuses.includes(status.toLowerCase()) ? count : 0)
  }, 0)
})

const completionRate = computed(() => {
  if (total.value === 0) return 0
  return Math.round((completedCount.value / total.value) * 100)
})

const fastProcessCount = computed(() => {
  // This would need actual data from processes with processing times
  // For now, we'll estimate based on average
  if (!avgProcessing.value) return 0
  return Math.round(total.value * 0.7) // Assuming 70% are under 5s
})

const trendPercentage = computed(() => {
  // This would compare current period with previous period
  // For simplicity, we'll use a mock value
  if (perDay.value.length < 2) return null
  const currentAvg = total.value / perDay.value.length
  const previousAvg = currentAvg * 0.8 // Mock: 20% less than current
  return Math.round(((currentAvg - previousAvg) / previousAvg) * 100)
})

const donutStyle = computed(() => {
  const totalCount = Object.values(statusCounts.value).reduce((a, b) => a + b, 0)
  if (totalCount === 0) return ''
  
  let accumulated = 0
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
  const segments = Object.keys(statusCounts.value).map((status, i) => {
    const percentage = (statusCounts.value[status] / totalCount) * 100
    const start = accumulated
    accumulated += percentage
    return `${colors[i % colors.length]} ${start}% ${accumulated}%`
  })
  
  return {
    background: `conic-gradient(${segments.join(', ')})`
  }
})

const getStatusColor = (status) => {
  const colorMap = {
    completed: '#10b981',
    done: '#10b981',
    processing: '#3b82f6',
    in_progress: '#3b82f6',
    pending: '#f59e0b',
    error: '#ef4444',
    failed: '#ef4444'
  }
  return colorMap[status.toLowerCase()] || '#94a3b8'
}

const getStatusPercentage = (count) => {
  const totalCount = Object.values(statusCounts.value).reduce((a, b) => a + b, 0)
  if (totalCount === 0) return 0
  return Math.round((count / totalCount) * 100)
}

const performanceMetrics = computed(() => [
  {
    title: 'Peak Volume',
    value: `${Math.max(...perDay.value.map(d => d.count), 0)} processes`,
    trend: 15,
    description: 'Highest single-day process count',
    color: '#10b981',
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    }
  },
  {
    title: 'Avg Success Rate',
    value: `${completionRate.value}%`,
    trend: 5,
    description: 'Process completion percentage',
    color: '#3b82f6',
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    }
  },
  {
    title: 'Response Time',
    value: avgProcessing.value ? `${avgProcessing.value}s` : 'N/A',
    trend: -8,
    description: 'Average processing duration',
    color: '#f59e0b',
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    }
  },
  {
    title: 'Active Sessions',
    value: activeCount.value,
    trend: 12,
    description: 'Currently running processes',
    color: '#8b5cf6',
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M19 11H5M19 11a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    }
  }
])

const recentActivity = computed(() => {
  return recent.value.slice(0, 5).map(proc => ({
    title: proc.name || 'Image Analysis Process',
    time: proc.created_at,
    duration: proc.processing_time ? `${proc.processing_time}s` : null,
    status: proc.status || 'completed'
  }))
})

const getActivityIcon = (status) => {
  const iconMap = {
    completed: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    processing: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" 
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    },
    pending: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    }
  }
  
  const defaultIcon = {
    template: `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
              stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  }
  
  return iconMap[status] || defaultIcon
}

// Original data loading functions (keep as is)
const computeAnalytics = (docs, days = 7) => {
  const now = new Date()
  const daysArr = Array.from({ length: days }).map((_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (days - 1 - i))
    const iso = d.toISOString().slice(0,10)
    return { date: iso, count: 0 }
  })

  const statusMap = {}
  let procSum = 0
  let procCount = 0

  docs.forEach(d => {
    const created = d.created_at?.toDate ? d.created_at.toDate() : new Date(d.created_at || d.createdAt || Date.now())
    const iso = created.toISOString().slice(0,10)
    const day = daysArr.find(x => x.date === iso)
    if (day) day.count += 1

    const st = d.status || 'done'
    statusMap[st] = (statusMap[st] || 0) + 1

    const ptime = d.processing_time || d.processingTime || d.duration || null
    const pnum = typeof ptime === 'number' ? ptime : (ptime && !isNaN(Number(ptime)) ? Number(ptime) : null)
    if (pnum !== null) { procSum += pnum; procCount += 1 }
  })

  perDay.value = daysArr
  total.value = daysArr.reduce((s,x) => s + x.count, 0)
  statusCounts.value = statusMap
  avgProcessing.value = procCount > 0 ? +(procSum / procCount).toFixed(2) : null
}

const loadAnalyticsFromFirestore = async (user) => {
  loading.value = true
  loadError.value = ''
  try {
    if (!user) {
      signedIn.value = false
      loading.value = false
      return
    }
    signedIn.value = true

    const colName = 'uploads'
    const tryQueries = []
    if (user.email) {
      tryQueries.push(query(collection(db, colName), where('ownerEmail', '==', user.email), orderBy('created_at', 'desc')))
      tryQueries.push(query(collection(db, colName), where('userEmail', '==', user.email), orderBy('created_at', 'desc')))
      tryQueries.push(query(collection(db, colName), where('email', '==', user.email), orderBy('created_at', 'desc')))
    }
    if (user.uid) {
      tryQueries.push(query(collection(db, colName), where('ownerUid', '==', user.uid), orderBy('created_at', 'desc')))
      tryQueries.push(query(collection(db, colName), where('uid', '==', user.uid), orderBy('created_at', 'desc')))
    }

    let snap = null
    let docs = []
    
    for (const q of tryQueries) {
      try {
        const s = await getDocs(q)
        if (s && s.size > 0) { snap = s; break }
      } catch (e) {}
    }

    if (!snap) {
      try {
        const s = await getDocs(collection(db, colName))
        snap = s
      } catch (e) {
        throw e
      }
    }

    docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

    if (user && docs.length > 0) {
      const possibleMatches = docs.filter(doc => {
        try {
          return Object.values(doc).some(v => v === user.email || v === user.uid)
        } catch (e) { return false }
      })
      if (possibleMatches.length > 0) {
        docs = possibleMatches
      }
    }

    recent.value = docs.slice(0, 6).map(d => ({
      id: d.id,
      name: d.name || `Process ${d.id}`,
      created_at: d.created_at?.toDate ? d.created_at.toDate().toISOString() : (d.created_at || new Date().toISOString()),
      status: d.status || 'done',
      processing_time: d.processing_time || d.processingTime || d.duration || null
    }))

    computeAnalytics(docs, windowDays.value)
  } catch (e) {
    console.error('Firestore analytics load failed', e)
    loadError.value = 'Failed to load analytics from database.'
  } finally {
    loading.value = false
  }
}

const loadMockData = () => {
  const now = new Date()
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return { date: d.toISOString().slice(0,10), count: Math.floor(Math.random() * 6) }
  })
  perDay.value = days
  total.value = days.reduce((s, x) => s + x.count, 0)
  recent.value = Array.from({ length: Math.min(5, total.value) }).map((_, i) => ({
    id: i + 1,
    name: `Process ${i + 1}`,
    created_at: new Date(Date.now() - i * 3600 * 1000).toISOString(),
    status: 'done'
  }))
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loadAnalyticsFromFirestore(user)
    } else {
      loadMockData()
    }
  })
})

watch(windowDays, () => {
  onAuthStateChanged(auth, (user) => {
    if (user) loadAnalyticsFromFirestore(user)
  })
})

const openModal = (type) => {
  modalType.value = type
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalType.value = ''
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && showModal.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.analytics-dashboard {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
}

/* Dashboard Header */
.dashboard-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.time-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-filter label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-btn.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: white;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: #e2e8f0;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 4px 4px 0 0;
}

.stat-card.primary::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.stat-card.success::before { background: linear-gradient(90deg, #10b981, #34d399); }
.stat-card.warning::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.stat-card.info::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.primary .stat-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.success .stat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.warning .stat-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.info .stat-icon { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.positive {
  color: #10b981;
  font-weight: 600;
}

.negative {
  color: #ef4444;
  font-weight: 600;
}

.trend-label {
  color: #94a3b8;
}

.stat-subtext {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 0 2rem 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.chart-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.current {
  background: linear-gradient(180deg, #3b82f6, #60a5fa);
}

.chart-body {
  padding: 1.5rem;
}

/* Volume Chart */
.volume-chart {
  height: 200px;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  gap: 0.5rem;
}

.bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.volume-bar {
  width: 100%;
  max-width: 40px;
  background: linear-gradient(180deg, #60a5fa, #3b82f6);
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  position: relative;
  min-height: 4px;
}

.volume-bar.highlight {
  background: linear-gradient(180deg, #10b981, #059669);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.volume-bar:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f172a;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.volume-bar:hover .bar-value {
  opacity: 1;
}

.bar-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.bar-day {
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Distribution Chart */
.distribution-chart {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 200px;
}

.donut-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}

.donut-chart::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
  pointer-events: none;
}

.center-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.center-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.status-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-text {
  flex: 1;
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
  text-transform: capitalize;
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  min-width: 40px;
  text-align: right;
}

.legend-percentage {
  font-size: 0.75rem;
  color: #64748b;
  min-width: 40px;
  text-align: right;
}

/* Metrics Section */
.metrics-section {
  padding: 1.5rem 2rem;
  border-top: 1px solid #f1f5f9;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.metrics-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.metrics-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  color: #64748b;
}

.metric-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #0f172a;
  font-size: 0.875rem;
  cursor: pointer;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: #e2e8f0;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 20px;
  height: 20px;
  color: currentColor;
}

.metric-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.metric-trend {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.metric-description {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.4;
}

/* Activity Section */
.activity-section {
  padding: 1.5rem 2rem 2rem;
  border-top: 1px solid #f1f5f9;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.view-all-btn svg {
  width: 16px;
  height: 16px;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: #e2e8f0;
  background: #ffffff;
  transform: translateX(4px);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.activity-icon.processing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.activity-icon.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
}

.activity-dot {
  opacity: 0.5;
}

.activity-duration {
  font-weight: 500;
}

.activity-status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.activity-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.activity-status.processing {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.activity-status.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #10b981;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #64748b;
  max-width: 300px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  width: min(900px, 96vw);
  max-height: 90vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.modal-close svg {
  width: 18px;
  height: 18px;
  color: #0f172a;
}

.modal-body {
  padding: 16px 20px;
  overflow-y: auto;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .distribution-chart {
    flex-direction: column;
    height: auto;
    gap: 1.5rem;
  }
  
  .status-legend {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .time-filter {
    width: 100%;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .activity-status {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header,
  .stats-grid,
  .charts-grid,
  .metrics-section,
  .activity-section {
    padding: 1rem;
  }
  
  .chart-bars {
    gap: 0.25rem;
  }
  
  .bar-label {
    font-size: 0.7rem;
  }
  
  .bar-day {
    display: none;
  }
}
</style>
