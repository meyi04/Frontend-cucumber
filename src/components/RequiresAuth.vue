<template>
  <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <div class="spinner"></div>
      <p class="mt-4 text-gray-600">{{ t('loading') }}</p>
    </div>
  </div>
  
  <div v-else-if="!authStore.isAuthenticated">
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ t('accessDenied') }}</h2>
        <p class="text-gray-600 mb-6">{{ t('loginRequired') }}</p>
        <router-link 
          to="/login" 
          class="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          {{ t('goToLogin') }}
        </router-link>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useLanguage } from '../store/language'

const authStore = useAuthStore()
const { t } = useLanguage()
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