<template>
  <aside class="sidebar-wrapper" :class="{ collapsed: isCollapsed, open: isOpen }">
    <nav class="sidebar" aria-label="Primary navigation" @click="handleNavClick">
      <div class="brand-row">
        <RouterLink to="/dashboard" class="brand" aria-label="Cu-Scan dashboard">
          <span class="brand-mark"><img src="/logo.png" alt="Cu-Scan logo" /></span>
          <span v-show="!isCollapsed" class="brand-copy">
            <strong>Cu-Scan</strong>
            <small>Plant health intelligence</small>
          </span>
        </RouterLink>
        <button class="sidebar-toggle" type="button" :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'" @click.stop="toggleSidebar">
          <svg viewBox="0 0 24 24" fill="none"><path :d="isCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>

      <p v-show="!isCollapsed" class="nav-label">Workspace</p>
      <div class="nav-links">
        <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }" :title="isCollapsed ? item.label : ''">
          <span class="nav-icon" v-html="item.icon"></span>
          <span v-show="!isCollapsed" class="nav-text">{{ item.label }}</span>
        </RouterLink>
      </div>

      <div class="sidebar-footer">
        <div v-show="!isCollapsed" class="help-card">
          <span class="help-icon">?</span>
          <div><strong>Need help?</strong><small>Visit the community forum</small></div>
        </div>
        <button class="user-section" type="button" @click.stop="toggleUserMenu">
          <span class="avatar-initials">{{ userInitials }}</span>
          <span v-show="!isCollapsed" class="user-info"><strong>{{ userName }}</strong><small>{{ userEmail || 'Account settings' }}</small></span>
          <svg v-show="!isCollapsed" class="chevron" :class="{ rotated: showUserMenu }" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div v-if="showUserMenu && !isCollapsed" class="user-dropdown">
          <button type="button" @click="navigateToProfile"><span>My profile</span><span>›</span></button>
          <button type="button" @click="openSettings"><span>Preferences</span><span>›</span></button>
          <button type="button" class="logout" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const emit = defineEmits(['close', 'openSettings'])
const props = defineProps({ isOpen: { type: Boolean, default: true } })
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isCollapsed = ref(false)
const showUserMenu = ref(false)

const icon = path => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>`
const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: icon('m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z') },
  { to: '/upload', label: 'New scan', icon: icon('M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5') },
  { to: '/history', label: 'Scan history', icon: icon('M3 12a9 9 0 1 0 3-6.7M3 4v5h5m4-4v7l4 2') },
  { to: '/diseases', label: 'Disease guide', icon: icon('M12 21c4-2.3 7-5.5 7-10a7 7 0 0 0-14 0c0 4.5 3 7.7 7 10Zm0-10v5m-2.5-2.5h5') },
  { to: '/forum', label: 'Community', icon: icon('M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9ZM8 9h8m-8 4h5') },
  { to: '/profile', label: 'My profile', icon: icon('M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z') }
]

const userName = computed(() => authStore.user?.displayName || authStore.user?.email?.split('@')[0] || 'User')
const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => userName.value.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase())
const isActive = target => route.path === target || (target === '/dashboard' && route.path === '/')

watch(() => props.isOpen, open => { if (open && window.innerWidth < 768) isCollapsed.value = false })
const toggleSidebar = () => { if (window.innerWidth < 768) return emit('close'); isCollapsed.value = !isCollapsed.value; showUserMenu.value = false }
const handleNavClick = event => { if (event.target.closest('a') && window.innerWidth < 768) emit('close') }
const toggleUserMenu = () => { if (!isCollapsed.value) showUserMenu.value = !showUserMenu.value }
const navigateToProfile = () => { router.push('/profile'); showUserMenu.value = false }
const openSettings = () => { showUserMenu.value = false; emit('openSettings') }
const handleLogout = async () => { try { await authStore.logout() } finally { router.push('/login') } }
const closeMenu = event => { if (!event.target.closest('.sidebar-footer')) showUserMenu.value = false }
onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<style scoped>
.sidebar-wrapper { position: fixed; inset: 0 auto 0 0; z-index: 1000; width: 276px; padding: 14px; transition: width .28s ease, transform .28s ease; }
.sidebar-wrapper.collapsed { width: 92px; }
.sidebar { height: 100%; padding: 18px 12px 12px; display: flex; flex-direction: column; color: #e7f6ef; background: linear-gradient(165deg, #073d31 0%, #062d26 54%, #051f1c 100%); border: 1px solid rgba(255,255,255,.1); border-radius: 24px; box-shadow: 16px 0 48px rgba(4,34,28,.12); }
.brand-row { min-height: 58px; display: flex; align-items: center; gap: 8px; margin: 0 2px 32px; }
.brand { min-width: 0; flex: 1; display: flex; align-items: center; gap: 11px; color: #fff; text-decoration: none; }
.brand-mark { width: 42px; height: 42px; display: grid; place-items: center; flex: 0 0 auto; padding: 5px; background: #f4fbf7; border-radius: 13px; box-shadow: 0 8px 20px rgba(0,0,0,.18); }
.brand-mark img { width: 100%; height: 100%; object-fit: contain; }
.brand-copy { min-width: 0; display: grid; gap: 1px; line-height: 1.1; }.brand-copy strong { font-size: 1.04rem; letter-spacing: -.02em; }.brand-copy small { color: #9cc8b5; font-size: .63rem; white-space: nowrap; }
.sidebar-toggle { width: 30px; height: 30px; display: grid; place-items: center; padding: 0; border: 1px solid rgba(255,255,255,.14); border-radius: 10px; color: #b9d8ca; background: rgba(255,255,255,.07); box-shadow: none; }.sidebar-toggle:hover { background: rgba(255,255,255,.13); transform: none; }.sidebar-toggle svg { width: 16px; }
.nav-label { margin: 0 10px 10px; color: #78a993; font-size: .66rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }.nav-links { display: grid; gap: 5px; }.nav-link { height: 46px; display: flex; align-items: center; gap: 13px; padding: 0 12px; border-radius: 13px; color: #c4ddd1; font-size: .9rem; font-weight: 650; text-decoration: none; transition: background .2s ease, color .2s ease, transform .2s ease; }.nav-link:hover { color: #fff; background: rgba(255,255,255,.08); transform: translateX(2px); }.nav-link.active { color: #fff; background: linear-gradient(90deg, #179d72, #117b5e); box-shadow: 0 8px 20px rgba(0,0,0,.16); }.nav-icon { width: 21px; height: 21px; display: grid; place-items: center; flex: 0 0 auto; }.nav-icon :deep(svg) { width: 21px; height: 21px; }.sidebar-wrapper.collapsed .nav-link { justify-content: center; padding: 0; }.sidebar-wrapper.collapsed .nav-link:hover { transform: none; }.nav-link[title] { position: relative; }.nav-link[title]::after { content: attr(title); position: absolute; left: calc(100% + 16px); padding: 7px 10px; color: white; background: #102b25; border-radius: 8px; font-size: .75rem; opacity: 0; pointer-events: none; transition: opacity .2s; white-space: nowrap; }.nav-link[title]:hover::after { opacity: 1; }
.sidebar-footer { position: relative; margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255,255,255,.09); }.help-card { display: flex; gap: 9px; align-items: center; padding: 10px; margin-bottom: 11px; color: #b9d8ca; background: rgba(255,255,255,.055); border-radius: 13px; }.help-card strong, .help-card small { display: block; }.help-card strong { color: #eaf6ef; font-size: .74rem; }.help-card small { margin-top: 2px; font-size: .63rem; }.help-icon { width: 25px; height: 25px; display: grid; place-items: center; flex: 0 0 auto; border-radius: 8px; background: rgba(89, 210, 156, .17); color: #82e3b5; font-size: .82rem; font-weight: 800; }.user-section { width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px; color: #fff; background: transparent; box-shadow: none; text-align: left; }.user-section:hover { background: rgba(255,255,255,.07); box-shadow: none; transform: none; }.avatar-initials { width: 36px; height: 36px; display: grid; place-items: center; flex: 0 0 auto; background: linear-gradient(135deg, #d8f3e5, #7ee0b1); color: #07523e; border-radius: 11px; font-size: .78rem; font-weight: 800; }.user-info { min-width: 0; flex: 1; display: grid; line-height: 1.2; }.user-info strong { overflow: hidden; font-size: .78rem; text-overflow: ellipsis; white-space: nowrap; }.user-info small { overflow: hidden; margin-top: 3px; color: #91bbaa; font-size: .62rem; text-overflow: ellipsis; white-space: nowrap; }.chevron { width: 16px; color: #a6cbb9; transition: transform .2s; }.chevron.rotated { transform: rotate(180deg); }.sidebar-wrapper.collapsed .user-section { justify-content: center; padding: 8px 0; }.user-dropdown { position: absolute; right: 0; bottom: 58px; left: 0; padding: 6px; display: grid; gap: 2px; background: #fff; border: 1px solid #dfe9e4; border-radius: 14px; box-shadow: 0 18px 35px rgba(0,0,0,.18); }.user-dropdown button { display: flex; justify-content: space-between; padding: 10px; color: #25433a; background: transparent; border-radius: 9px; box-shadow: none; font-size: .78rem; }.user-dropdown button:hover { color: #067353; background: #edf9f3; box-shadow: none; transform: none; }.user-dropdown .logout { color: #c34545; }
@media (max-width: 767px) { .sidebar-wrapper { width: min(88vw, 320px); padding: 10px; transform: translateX(-110%); }.sidebar-wrapper.open { transform: translateX(0); }.sidebar-wrapper.collapsed { width: min(88vw, 320px); }.sidebar { border-radius: 20px; }.sidebar-toggle { display: none; } }
</style>
