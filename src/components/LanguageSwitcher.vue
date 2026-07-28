<template>
  <div class="language-switcher" :class="{ 'mobile': isMobile }">
    <button 
      class="lang-btn" 
      @click="toggleDropdown"
      :class="{ 'active': showDropdown }"
    >
      <span class="lang-flag">{{ languages[currentLanguage].flag }}</span>
      <span class="lang-code">{{ languages[currentLanguage].code.toUpperCase() }}</span>
      <svg class="chevron" :class="{ 'rotated': showDropdown }" viewBox="0 0 20 20" fill="none">
        <path d="M5 7L10 12L15 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <transition name="dropdown">
      <div v-if="showDropdown" class="dropdown-menu">
        <button 
          v-for="lang in Object.values(languages)" 
          :key="lang.code"
          class="dropdown-item"
          :class="{ 'active': currentLanguage === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          <span class="lang-flag">{{ lang.flag }}</span>
          <span class="lang-name">{{ lang.name }}</span>
          <span v-if="currentLanguage === lang.code" class="check">✓</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../store/language'

const { currentLanguage, languages, setLanguage } = useLanguage()
const showDropdown = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectLanguage = (langCode) => {
  setLanguage(langCode)
  showDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.language-switcher')) {
    showDropdown.value = false
  }
}

// Handle resize
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  color: #10b981;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
}

.lang-btn.active {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
}

.lang-flag {
  font-size: 1.2rem;
}

.lang-code {
  font-size: 0.875rem;
  font-weight: 600;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 160px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(16, 185, 129, 0.1);
  color: white;
}

.dropdown-item.active {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.lang-name {
  flex: 1;
  font-size: 0.875rem;
}

.check {
  color: #10b981;
  font-weight: 600;
}

/* Mobile styles */
.language-switcher.mobile .lang-btn {
  padding: 0.4rem 0.75rem;
}

.language-switcher.mobile .lang-code {
  display: none;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>