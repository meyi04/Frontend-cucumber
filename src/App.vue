<template>
  <div class="app-shell min-h-screen bg-gray-100">
    <!-- Show loading only briefly -->
    <div v-if="initialLoading && !isAppReady" class="app-loading-screen">
      <div class="app-loading-card">
        <div class="app-loading-logo">
          <img src="/logo.png" alt="Cu-Scan" />
        </div>
        <strong>Cu-Scan</strong>
        <div class="spinner"></div>
        <p>Loading application...</p>
      </div>
    </div>

    <!-- Main app content -->
    <div v-show="isAppReady">
      <!-- Hamburger Menu Button (only when authenticated) -->
      <button 
        v-if="showNavbar" 
        class="hamburger-btn" 
        @click="toggleSidebar"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Sidebar Overlay -->
      <div 
        v-if="showNavbar && isSidebarOpen && isMobile" 
        class="sidebar-overlay"
        @click="toggleSidebar"
      ></div>

      <!-- Sidebar Navigation -->
      <Navbar 
        v-if="showNavbar && (!isMobile || isSidebarOpen)" 
        :is-open="isSidebarOpen"
        @close="closeSidebar"
        @openSettings="showSettings = true"
      />

      <!-- Page Content -->
      <main class="main-content" :class="{ 'with-sidebar': showNavbar && !isMobile }">
        <router-view />
      </main>
      <Chatbot v-if="showNavbar" />
      <SettingsModal v-if="showSettings" @close="showSettings = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import Navbar from './components/Navbar.vue'
import SettingsModal from './components/SettingsModal.vue'
import { initializeBackendCheck } from './utils/backend-check'
import Chatbot from './components/Chatbot.vue'
import { useLanguage } from './store/language'

const route = useRoute()
const authStore = useAuthStore()
const initialLoading = ref(true)
const isAppReady = ref(false)
const isSidebarOpen = ref(false)
const showSettings = ref(false)
const isMobile = ref(window.innerWidth < 768)
const { loadLanguagePreference } = useLanguage()
let loadedLanguageUserId = null
let languageLoadPromise = Promise.resolve()

const loadUserLanguage = (user) => {
  if (!user?.uid) return Promise.resolve()
  if (loadedLanguageUserId === user.uid) return languageLoadPromise

  loadedLanguageUserId = user.uid
  languageLoadPromise = loadLanguagePreference(user)
  return languageLoadPromise
}

watch(() => authStore.user?.uid, (userId) => {
  if (!userId) {
    loadedLanguageUserId = null
    return
  }
  loadUserLanguage(authStore.user)
})

// Non-blocking initialization
onMounted(async () => {
  await authStore.initializeAuth()
  await loadUserLanguage(authStore.user)

  setTimeout(() => {
    initialLoading.value = false
    setTimeout(() => {
      isAppReady.value = true
    }, 300)
  }, 500)
  
  initializeBackendCheck().then(result => {
    if (!result.success) {
      console.error('Backend connection failed:', result.error)
    }
  })

})

// Hide sidebar on auth pages
const showNavbar = computed(() => {
  const authRoutes = ['/', '/login', '/register', '/forgot-password']
  return !authRoutes.includes(route.path) && authStore.isAuthenticated
})

// Toggle sidebar
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Close sidebar
const closeSidebar = () => {
  isSidebarOpen.value = false
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #f8fcfa, #eaf7f0);
}

.app-loading-card {
  display: grid;
  justify-items: center;
  gap: 12px;
  color: #07523e;
  text-align: center;
}

.app-loading-logo {
  width: 86px;
  height: 86px;
  display: grid;
  place-items: center;
  padding: 11px;
  background: #fff;
  border: 1px solid rgba(16, 185, 129, .16);
  border-radius: 25px;
  box-shadow: 0 18px 45px rgba(7, 82, 62, .14);
  animation: logo-pulse 1.6s ease-in-out infinite;
}

.app-loading-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.app-loading-card strong {
  font-size: 1.25rem;
  letter-spacing: -.03em;
}

.app-loading-card p {
  margin: -4px 0 0;
  color: #6b8177;
  font-size: .82rem;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(16, 185, 129, 0.18);
  border-top-color: rgba(16, 185, 129, 1);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
  margin: 0 auto;
}

@keyframes logo-pulse {
  0%, 100% { transform: scale(1); opacity: .9; }
  50% { transform: scale(1.05); opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hamburger-btn {
  position: fixed;
  top: 22px;
  left: 22px;
  z-index: 1100;
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(16, 185, 129, 0.18);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
  transition: transform 0.25s ease, background 0.25s ease;
}

.hamburger-btn:hover {
  transform: translateY(-2px);
  background: white;
}

.hamburger-btn svg {
  width: 24px;
  height: 24px;
  color: #0f172a;
}

@media (min-width: 768px) {
  .hamburger-btn {
    display: none;
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 998;
  backdrop-filter: blur(6px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.main-content {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding: 24px 24px 28px;
  transition: padding-left 0.3s ease, transform 0.3s ease;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (min-width: 1440px) {
  .main-content {
    padding: 32px 40px 36px;
  }
}

@media (min-width: 768px) {
  .main-content.with-sidebar {
    padding-left: 300px;
  }
}

@media (max-width: 767px) {
  .main-content {
    padding: 18px 14px 24px;
    max-width: 100%;
  }
}
</style>
  