import { defineStore } from 'pinia'
import { auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const _authInitialized = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.displayName || user.value?.email?.split('@')[0] || 'User')
  const userEmail = computed(() => user.value?.email || '')
  const userInitials = computed(() => {
    const name = userName.value
    return name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  // Actions
  const initializeAuth = async () => {
    if (_authInitialized.value) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        loading.value = true

        const unsubscribe = onAuthStateChanged(auth,
          (authUser) => {
            user.value = authUser
            loading.value = false
            _authInitialized.value = true
            resolve()
            unsubscribe()
          },
          (authError) => {
            console.error('Auth state change error:', authError)
            error.value = authError.message
            loading.value = false
            _authInitialized.value = true
            resolve()
          }
        )

        setTimeout(() => {
          if (!_authInitialized.value) {
            loading.value = false
            _authInitialized.value = true
            console.warn('Auth initialization timeout')
            resolve()
          }
        }, 5000)
      }, 0)
    })
  }

  const login = async (email, password) => {
    error.value = null
    loading.value = true

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Check email verification
      if (!user.value.emailVerified) {
        error.value = 'Please verify your email before logging in'
        await signOut(auth)
        user.value = null
        loading.value = false
        return { success: false, message: 'Email not verified' }
      }

      loading.value = false
      return { success: true }
    } catch (authError) {
      error.value = authError.message
      loading.value = false
      return { success: false, message: authError.message }
    }
  }

  const register = async (email, password, name) => {
    error.value = null
    loading.value = true

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      // Send verification email
      await sendEmailVerification(user.value)

      // Update user profile with name if provided
      // if (name) {
      //   await updateProfile(user.value, { displayName: name })
      // }

      loading.value = false
      return { success: true }
    } catch (authError) {
      error.value = authError.message
      loading.value = false
      return { success: false, message: authError.message }
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      await signOut(auth)
      user.value = null
      error.value = null
      loading.value = false
      return { success: true }
    } catch (authError) {
      error.value = authError.message
      loading.value = false
      return { success: false, message: authError.message }
    }
  }

  const resetPassword = async (email) => {
    error.value = null
    loading.value = true

    try {
      await sendPasswordResetEmail(auth, email)
      loading.value = false
      return { success: true }
    } catch (authError) {
      error.value = authError.message
      loading.value = false
      return { success: false, message: authError.message }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const resendVerificationEmail = async () => {
    if (!user.value) {
      error.value = 'No user logged in'
      return { success: false, message: 'No user logged in' }
    }

    loading.value = true
    try {
      await sendEmailVerification(user.value)
      loading.value = false
      return { success: true }
    } catch (authError) {
      error.value = authError.message
      loading.value = false
      return { success: false, message: authError.message }
    }
  }

  // Return all state and actions
  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    userName,
    userEmail,
    userInitials,

    // Actions
    initializeAuth,
    login,
    register,
    logout,
    resetPassword,
    clearError,
    resendVerificationEmail
  }
})