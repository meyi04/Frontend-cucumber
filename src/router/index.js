import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue')
  },
  {
    path: '/diseases',
    name: 'Diseases',
    component: () => import('../views/Diseases.vue')
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/Forum.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../views/Upload.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Lazy load auth store inside the guard to prevent early initialization
router.beforeEach(async (to, from, next) => {
  // Dynamically import the auth store only when needed
  const { useAuthStore } = await import('../store/auth')
  const authStore = useAuthStore()

  // Don't block navigation during auth initialization
  // Use non-blocking approach
  let authCheckComplete = false

  // Start auth initialization but don't wait indefinitely
  const authPromise = authStore.initializeAuth()

  // Set a timeout to prevent hanging
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => {
      if (!authCheckComplete) {
        console.log('Auth check taking too long, proceeding...')
        resolve()
      }
    }, 1000) // 1 second timeout
  })

  // Wait for either auth to initialize or timeout
  await Promise.race([authPromise, timeoutPromise])
  authCheckComplete = true

  const isAuthenticated = authStore.isAuthenticated

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
