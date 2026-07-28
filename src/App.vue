<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Show loading only briefly -->
    <div v-if="initialLoading && !isAppReady" class="fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-300">
      <div class="text-center">
        <div class="spinner"></div>
        <p class="mt-4 text-gray-600">Loading application...</p>
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
      />

      <!-- Page Content -->
      <main class="main-content" :class="{ 'with-sidebar': showNavbar && !isMobile }">
        <router-view />
      </main>
      <Chatbot v-if="showNavbar" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './store/auth'
import Navbar from './components/Navbar.vue'
import { initializeBackendCheck } from './utils/backend-check'
import Chatbot from './components/Chatbot.vue' // Add this import
import { useLanguage } from './store/language'

const route = useRoute()
const authStore = useAuthStore()
const initialLoading = ref(true)
const isAppReady = ref(false)
const isSidebarOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const { setLanguage } = useLanguage()

// Non-blocking initialization
onMounted(async () => {
  authStore.initializeAuth().finally(() => {
    setTimeout(() => {
      initialLoading.value = false
      setTimeout(() => {
        isAppReady.value = true
      }, 300)
    }, 500)
  })
  
  initializeBackendCheck().then(result => {
    if (!result.success) {
      console.error('Backend connection failed:', result.error)
    }
  })
  
  // Check screen size
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
    const savedLang = localStorage.getItem('preferredLanguage')
  if (savedLang) {
    setLanguage(savedLang)
  }
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
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Hamburger Button */
.hamburger-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  width: 44px;
  height: 44px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.hamburger-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.hamburger-btn svg {
  width: 24px;
  height: 24px;
  color: #475569;
}

/* Hide hamburger on desktop when sidebar is open */
@media (min-width: 768px) {
  .hamburger-btn {
    display: none;
  }
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Main Content */
.main-content {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding: 20px 16px 24px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 100%;
}

/* When sidebar is visible, add left padding on desktop */
@media (min-width: 768px) {
  .main-content.with-sidebar {
    padding-left: 70px; /* Same as collapsed sidebar width */
    transition: padding-left 0.3s ease;
  }
}

@media (max-width: 767px) {
  .main-content {
    padding: 16px 12px 24px;
  }
}
</style>