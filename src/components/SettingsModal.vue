<template>
  <div class="settings-backdrop" @click.self="close">
    <div class="settings-panel">
      <div class="settings-header">
        <div>
          <h2>{{ t('displaySettings') }}</h2>
          <p>{{ t('settingsSubtitle') }}</p>
        </div>
        <button class="close-btn" @click="close">×</button>
      </div>

      <section class="settings-section">
        <h3>{{ t('theme') }}</h3>
        <div class="option-list">
          <label class="option-item">
            <input type="radio" value="light" v-model="themeMode" />
            <span>{{ t('lightMode') }}</span>
          </label>
          <label class="option-item">
            <input type="radio" value="dark" v-model="themeMode" />
            <span>{{ t('darkMode') }}</span>
          </label>
        </div>
      </section>

      <section class="settings-section">
        <h3>{{ t('fontSize') }}</h3>
        <div class="option-list">
          <label class="option-item">
            <input type="radio" value="normal" v-model="fontSize" />
            <span>{{ t('normal') }}</span>
          </label>
          <label class="option-item">
            <input type="radio" value="large" v-model="fontSize" />
            <span>{{ t('largeAccessibility') }}</span>
          </label>
        </div>
      </section>

      <section class="settings-section">
        <h3>{{ t('language') }}</h3>
        <div class="option-list language-list">
          <button
            v-for="lang in Object.values(languages)"
            :key="lang.code"
            :class="['lang-option', { active: currentLanguage === lang.code }]"
            @click="selectLanguage(lang.code)"
          >
            <span class="flag">{{ lang.flag }}</span>
            <span>{{ lang.name }}</span>
          </button>
        </div>
      </section>

      <section class="settings-section">
        <h3>{{ t('layoutMode') }}</h3>
        <div class="option-list">
          <label class="option-item">
            <input type="radio" value="full" v-model="layoutMode" />
            <span>{{ t('fullLayout') }}</span>
          </label>
          <label class="option-item">
            <input type="radio" value="compact" v-model="layoutMode" />
            <span>{{ t('compactLayout') }}</span>
          </label>
        </div>
      </section>

      <div class="settings-actions">
        <button class="primary-btn" @click="close">{{ t('close') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useLanguage } from '../store/language'

const emit = defineEmits(['close'])
const { currentLanguage, languages, setLanguage, t } = useLanguage()

const themeMode = ref('light')
const fontSize = ref('normal')
const layoutMode = ref('full')

const applyTheme = () => {
  document.documentElement.classList.toggle('dark-mode', themeMode.value === 'dark')
  localStorage.setItem('themeMode', themeMode.value)
}

const applyFontSize = () => {
  document.documentElement.classList.toggle('font-large', fontSize.value === 'large')
  localStorage.setItem('fontSize', fontSize.value)
}

const applyLayoutMode = () => {
  document.documentElement.classList.toggle('compact-layout', layoutMode.value === 'compact')
  localStorage.setItem('layoutMode', layoutMode.value)
}

const selectLanguage = (langCode) => {
  setLanguage(langCode)
}

const close = () => {
  emit('close')
}

watch(themeMode, applyTheme)
watch(fontSize, applyFontSize)
watch(layoutMode, applyLayoutMode)

onMounted(() => {
  const savedTheme = localStorage.getItem('themeMode')
  const savedFont = localStorage.getItem('fontSize')
  const savedLayout = localStorage.getItem('layoutMode')

  if (savedTheme === 'dark' || savedTheme === 'light') themeMode.value = savedTheme
  if (savedFont === 'large' || savedFont === 'normal') fontSize.value = savedFont
  if (savedLayout === 'compact' || savedLayout === 'full') layoutMode.value = savedLayout

  applyTheme()
  applyFontSize()
  applyLayoutMode()
})
</script>

<style scoped>
.settings-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.settings-panel {
  width: min(560px, 100%);
  max-height: min(90vh, 760px);
  overflow-y: auto;
  background: #f8fafc;
  border-radius: 24px;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.22);
  padding: 24px;
  color: #0f172a;
}

.dark-mode .settings-panel {
  background: #0f172a;
  color: #f8fafc;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
  margin-bottom: 24px;
}

.settings-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.settings-header p {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.05);
  color: #0f172a;
  font-size: 1.4rem;
  cursor: pointer;
}

.dark-mode .close-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
}

.settings-section {
  margin-bottom: 22px;
}

.settings-section h3 {
  font-size: 1rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.option-list {
  display: grid;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: #10b981;
}

.option-item input {
  accent-color: #10b981;
}

.dark-mode .option-item {
  background: #111827;
  border-color: #334155;
}

.language-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lang-option:hover {
  border-color: #10b981;
}

.lang-option.active {
  background: rgba(16, 185, 129, 0.12);
  border-color: #10b981;
}

.dark-mode .lang-option {
  background: #111827;
  color: #f8fafc;
  border-color: #334155;
}

.flag {
  font-size: 1.1rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.primary-btn {
  padding: 12px 22px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>
