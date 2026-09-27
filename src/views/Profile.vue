<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="profile-title">{{ t('profileSettings') }}</h1>
      <p class="profile-subtitle">{{ t('manageAccount') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ t('loadingProfile') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <svg viewBox="0 0 24 24" fill="none" class="error-icon">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p>{{ error }}</p>
      <button @click="loadUserData" class="retry-btn">{{ t('retry') }}</button>
    </div>

    <!-- Profile Content -->
    <div v-else class="profile-content">
      <div class="profile-card">
        <div class="profile-info">
          <div class="avatar-section">
            <div class="avatar" :style="{ background: avatarGradient }">
              <span class="avatar-text">{{ userInitials }}</span>
            </div>
            <div class="avatar-info">
              <h3>{{ userData.displayName || authStore.userName || 'User' }}</h3>
              <p>{{ authStore.user?.email }}</p>
              <div class="verification-status" :class="{ verified: authStore.user?.emailVerified }">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 12L11 15L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ authStore.user?.emailVerified ? t('emailVerified') : t('emailNotVerified') }}</span>
                <button v-if="!authStore.user?.emailVerified" @click="resendVerification" class="verify-link">
                  {{ t('resendVerificationEmail') }}
                </button>
              </div>
              <div class="member-since">
                <svg viewBox="0 0 24 24" fill="none" class="calendar-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="1.5"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>{{ t('memberSince') }}: {{ memberSince }}</span>
              </div>
            </div>
          </div>

          <div class="account-stats">
            <div class="stat-item" @click="navigateToHistory">
              <span class="stat-value">{{ userStats.totalAnalyses || 0 }}</span>
              <span class="stat-label">{{ t('totalAnalyses') }}</span>
            </div>
            <div class="stat-item" @click="filterHistory('healthy')">
              <span class="stat-value" style="color: #10b981;">{{ userStats.healthyCount || 0 }}</span>
              <span class="stat-label">{{ t('healthy') }}</span>
            </div>
            <div class="stat-item" @click="filterHistory('infected')">
              <span class="stat-value" style="color: #ef4444;">{{ userStats.infectedCount || 0 }}</span>
              <span class="stat-label">{{ t('infected') }}</span>
            </div>
            <div class="stat-item" @click="navigateToHistory">
              <span class="stat-value">{{ userStats.recentAnalyses || 0 }}</span>
              <span class="stat-label">{{ t('recentSevenDays') }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Analyses Section -->
        <div class="recent-analyses-section">
          <h3 class="section-title">{{ t('recentAnalyses') }}</h3>
          <div v-if="recentAnalysesList.length === 0" class="empty-state">
            <p>{{ t('noAnalysesStart') }}</p>
          </div>
          <div v-else class="analyses-grid">
            <div v-for="analysis in recentAnalysesList" :key="analysis.id" class="analysis-card">
              <div class="analysis-image">
                <img v-if="analysis.imageUrl" :src="analysis.imageUrl" :alt="analysis.disease" />
                <div v-else class="no-image">{{ t('noImage') }}</div>
              </div>
              <div class="analysis-info">
                <h4>{{ analysis.disease || 'Unknown' }}</h4>
                <p class="analysis-confidence">
                  {{ t('confidence') }}: <strong>{{ (analysis.confidence * 1).toFixed(1) }}%</strong>
                </p>
                <p class="analysis-date">
                  {{ formatDate(analysis.timestamp) }}
                </p>
                <div class="analysis-status" :class="getStatusClass(analysis.result || analysis.status)">
                  {{ analysis.result || analysis.status || 'Unknown' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Details Section -->
        <div class="details-section">
          <h3 class="section-title">{{ t('accountDetails') }}</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">{{ t('userId') }}:</span>
              <span class="detail-value">{{ authStore.user?.uid }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('accountCreated') }}:</span>
              <span class="detail-value">{{ formatDate(authStore.user?.metadata?.creationTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('lastLogin') }}:</span>
              <span class="detail-value">{{ formatDate(authStore.user?.metadata?.lastSignInTime) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('emailStatus') }}:</span>
              <span class="detail-value" :class="{ 'text-emerald-500': authStore.user?.emailVerified, 'text-amber-500': !authStore.user?.emailVerified }">
                {{ authStore.user?.emailVerified ? t('verified') : t('pendingVerification') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="actions-section">
          <h3 class="section-title">{{ t('accountActions') }}</h3>
          <div class="actions-grid">
            <button @click="navigateToUpload" class="action-btn primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M21 16V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ t('uploadNewImage') }}
            </button>
            <button @click="navigateToHistory" class="action-btn secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ t('viewHistory') }}
            </button>
            <button @click="resetPassword" class="action-btn tertiary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 7C16.65 8.67 17.66 11 17 13C16.34 15 14.67 16.33 12 16.67C9.33 17 7 16 5 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M9 17L8 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M15 7L17 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M9 17C9 17 9.67 18 11 18C12.33 18 13 17 13 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ t('resetPassword') }}
            </button>
            <button @click="logout" class="action-btn danger">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
  limit,
  doc,
  getDoc
} from 'firebase/firestore'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLanguage()
const loading = ref(true)
const error = ref('')
const userData = ref({})
const recentAnalysesList = ref([])
const userStats = ref({
  totalAnalyses: 0,
  healthyCount: 0,
  infectedCount: 0,
  recentAnalyses: 0
})

// Computed properties
const userInitials = computed(() => {
  const name = userData.value.displayName || authStore.userName || 'User'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const avatarGradient = computed(() => {
  const colors = [
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    'linear-gradient(135deg, #ef4444, #f87171)'
  ]
  const hash = authStore.user?.uid?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0
  return colors[hash % colors.length]
})

const memberSince = computed(() => {
  if (!authStore.user?.metadata?.creationTime) return t('notAvailable')
  const date = new Date(authStore.user.metadata.creationTime)
  return date.toLocaleDateString(t('locale') || 'en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

// Methods
const formatDate = (timestamp) => {
  if (!timestamp) return t('notAvailable')
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString(t('locale') || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  if (status === 'healthy') return 'status-healthy'
  if (status === 'infected') return 'status-infected'
  return 'status-unknown'
}

const loadUserData = async () => {
  if (!authStore.user?.uid) {
    error.value = t('noUserLoggedIn')
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''
    
    // Load user profile data from Firestore
    const userDocRef = doc(db, 'users', authStore.user.uid)
    const userDoc = await getDoc(userDocRef)
    
    if (userDoc.exists()) {
      userData.value = userDoc.data()
    } else {
      userData.value = {
        displayName: authStore.userName,
        createdAt: new Date().toISOString()
      }
    }

    // Load user analysis statistics
    await loadUserStats()
    await loadRecentAnalyses()
    
  } catch (err) {
    console.error('Error loading user data:', err)
    error.value = t('failedLoadProfile')
  } finally {
    loading.value = false
  }
}

const loadUserStats = async () => {
  try {
    const userId = authStore.user.uid
    const now = new Date()
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7))

    // Query for user's uploads
    const uploadsRef = collection(db, 'uploads')
    const userUploadsQuery = query(uploadsRef, where('userId', '==', userId))
    const snapshot = await getDocs(userUploadsQuery)
    
    const stats = {
      totalAnalyses: 0,
      healthyCount: 0,
      infectedCount: 0,
      recentAnalyses: 0
    }
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      stats.totalAnalyses++
      
      // Check if healthy or infected
      const status = data.status || data.result || data.disease || ''
      if (status.toLowerCase() === 'healthy') {
        stats.healthyCount++
      } else if (status.toLowerCase() === 'infected') {
        stats.infectedCount++
      }
      
      // Check if recent (within 7 days)
      const uploadDate = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
      if (uploadDate > sevenDaysAgo) {
        stats.recentAnalyses++
      }
    })
    
    userStats.value = stats
    
  } catch (err) {
    console.error('Error loading user stats:', err)
    userStats.value = {
      totalAnalyses: 0,
      healthyCount: 0,
      infectedCount: 0,
      recentAnalyses: 0
    }
  }
}

const loadRecentAnalyses = async () => {
  try {
    const userId = authStore.user.uid
    const uploadsRef = collection(db, 'uploads')
    
    // Query: user's uploads ordered by timestamp, latest first, limit 5
    const recentQuery = query(
      uploadsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(5)
    )
    
    const snapshot = await getDocs(recentQuery)
    const uploads = []
    
    snapshot.forEach((doc) => {
      uploads.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    recentAnalysesList.value = uploads
    
  } catch (err) {
    console.error('Error loading recent analyses:', err)
    recentAnalysesList.value = []
  }
}
const navigateToHistory = () => {
  router.push('/history')
}

const navigateToUpload = () => {
  router.push('/upload')
}

const filterHistory = (filter) => {
  router.push({ path: '/history', query: { filter } })
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout error:', err)
    router.push('/login')
  }
}

const resetPassword = () => {
  const email = authStore.user?.email
  if (email) {
    authStore.resetPassword(email)
      .then(() => {
        alert(t('passwordResetSent', { email }))
      })
      .catch(() => {
        alert(t('operationFailed'))
      })
  }
}

const resendVerification = () => {
  authStore.resendVerificationEmail()
    .then(() => {
      alert(t('verificationEmailSent'))
    })
    .catch(() => {
      alert(t('operationFailed'))
    })
}

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile-container {
  margin-top: 0px;
  padding: 24px;
}

.profile-header {
  margin-bottom: 32px;
}

.profile-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-top: 5px;
  margin-bottom: 8px;
}

.profile-subtitle {
  color: #64748b;
  font-size: 1.125rem;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 32px;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #dc2626;
}

/* Profile Info */
.profile-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.avatar-info h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.avatar-info p {
  color: #64748b;
  margin-bottom: 12px;
  font-size: 1.125rem;
}

.verification-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.verification-status.verified {
  color: #10b981;
}

.verification-status:not(.verified) {
  color: #f59e0b;
}

.verify-link {
  margin-left: 8px;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 0.875rem;
}

.verify-link:hover {
  color: #2563eb;
}

.member-since {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.875rem;
}

.calendar-icon {
  width: 16px;
  height: 16px;
}

/* Account Stats */
.account-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.stat-item:hover {
  border-color: #10b981;
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Recent Analyses Section */
.recent-analyses-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.analyses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.analysis-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.analysis-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.analysis-image {
  width: 100%;
  height: 150px;
  background: #e2e8f0;
  overflow: hidden;
}

.analysis-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.analysis-info {
  padding: 12px;
}

.analysis-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.analysis-confidence {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 4px;
}

.analysis-date {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 8px;
}

.analysis-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-healthy {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-infected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-unknown {
  background: rgba(148, 163, 184, 0.1);
  color: #64748b;
}

/* Details Section */
.details-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
  word-break: break-all;
}

/* Actions Section */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.action-btn.secondary {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.action-btn.tertiary {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-btn.danger {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-info {
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
  }
  
  .account-stats {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .analyses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
    margin-top: 20px;
  }
  
  .profile-card {
    padding: 24px;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .account-stats {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .analyses-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-title {
    font-size: 1.5rem;
  }
  
  .profile-subtitle {
    font-size: 1rem;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    font-size: 1.5rem;
  }
  
  .avatar-info h3 {
    font-size: 1.5rem;
  }
}
</style>