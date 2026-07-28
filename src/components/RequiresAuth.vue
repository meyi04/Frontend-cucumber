<template>
  <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="spinner"></div>
      <p class="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
  
  <div v-else-if="!authStore.isAuthenticated">
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p class="text-gray-600 mb-6">You need to be logged in to view this page.</p>
        <router-link 
          to="/login" 
          class="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Go to Login
        </router-link>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
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
</style>