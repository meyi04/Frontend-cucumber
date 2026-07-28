<template>
  <div class="login-container">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Main Card -->
    <div class="login-card">
      <!-- Header -->
    <div class="login-header">
  <div class="logo-section-large">
    <!-- Large Logo with Glow Effect -->
    <div class="logo-container">
      <img src="/logo.png" alt="CucumberAI" class="main-logo" />
      <div class="logo-glow"></div>
    </div>
    
    <div class="logo-text-center">
      <h1>Cucumber<span class="logo-highlight">AI</span></h1>
      <p class="logo-subtitle">Intelligent Plant Disease Detection</p>
    </div>
  </div>
  
  <div class="header-content">
    <h2 class="login-title">Welcome Back</h2>
    <p class="login-subtitle">Sign in to access your dashboard</p>
  </div>
</div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Email Address
          </label>
          <div class="input-wrapper">
            <input
              v-model="email"
              type="email"
              id="email"
              required
              placeholder="you@example.com"
              :class="{ 'error': errors.email }"
              @input="clearError('email')"
            />
            <div v-if="errors.email" class="input-error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>{{ errors.email }}</span>
            </div>
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 8.5C17 7.57174 17 7.1076 16.9487 6.75159C16.3625 3.18519 13.2715 1.13907 9.78009 1.92705C9.28879 2.03956 8.78912 2.24283 8 2.55937M7 22H17C18.8856 22 19.8284 22 20.4142 21.4142C21 20.8284 21 19.8856 21 18C21 16.1144 21 15.1716 20.4142 14.5858C19.8284 14 18.8856 14 17 14H7C5.11438 14 4.17157 14 3.58579 14.5858C3 15.1716 3 16.1144 3 18C3 19.8856 3 20.8284 3.58579 21.4142C4.17157 22 5.11438 22 7 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Password
          </label>
          <div class="input-wrapper">
            <div class="password-input">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                required
                placeholder="Enter your password"
                :class="{ 'error': errors.password }"
                @input="clearError('password')"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12C2 12 5 4 12 4C19 4 22 12 22 12C22 12 19 20 12 20C5 20 2 12 2 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div v-if="errors.password" class="input-error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>{{ errors.password }}</span>
            </div>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">Remember me</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="error-message">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>{{ authStore.error }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M11 16L15 12M15 12L11 8M15 12H3M21 12C21 16.9706 16.9706 21 12 21C9.34784 21 6.8043 19.9464 4.92893 18.0711C3.05357 16.1957 2 13.6522 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20.0057 11.1667 20.0057 11.8333 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sign In
          </span>
          <span v-else>
            <div class="spinner"></div>
            Signing in...
          </span>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Register Link -->
        <div class="register-link">
          <p>Don't have an account? <router-link to="/register">Create account</router-link></p>
        </div>
      </form>
    </div>

    <!-- Verification Reminder Modal -->
    <div v-if="showVerificationModal" class="modal-overlay" @click.self="showVerificationModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Verify Your Email</h3>
          <button @click="showVerificationModal = false" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="verification-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h4>Check Your Email</h4>
          <p>We've sent a verification link to <strong>{{ email }}</strong></p>
          <p class="modal-subtext">Please check your inbox and click the verification link to activate your account.</p>
          <div class="modal-actions">
            <button @click="resendVerification" class="modal-btn primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 14 3.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.51 15C4.0172 16.4332 4.87907 17.7146 6.01547 18.7246C7.15186 19.7346 8.52549 20.4402 10 20.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Resend Email
            </button>
            <button @click="showVerificationModal = false" class="modal-btn secondary">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isSubmitting = ref(false)
const showVerificationModal = ref(false)

// Form errors
const errors = reactive({
  email: '',
  password: ''
})

// Initialize auth
onMounted(() => {
  authStore.initializeAuth()
  
  // Clear any previous errors
  authStore.clearError()
  
  // Load saved email if "remember me" was checked
  const savedEmail = localStorage.getItem('rememberedEmail')
  if (savedEmail) {
    email.value = savedEmail
    rememberMe.value = true
  }
})

// Form validation
const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(email.value)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!password.value) {
    errors.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

// Clear specific error
const clearError = (field) => {
  errors[field] = ''
  authStore.clearError()
}

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  // Save email if "remember me" is checked
  if (rememberMe.value) {
    localStorage.setItem('rememberedEmail', email.value)
  } else {
    localStorage.removeItem('rememberedEmail')
  }

  // Attempt login
  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    // Navigate to dashboard
    router.push('/dashboard')
  } else {
    // Show verification modal if email not verified
    if (result.message.includes('verify your email')) {
      showVerificationModal.value = true
    }
  }

  isSubmitting.value = false
}

// Resend verification email
const resendVerification = async () => {
  const result = await authStore.resendVerificationEmail(email.value)
  if (result.success) {
    // Show success message (you could add a toast notification here)
    console.log('Verification email resent!')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
  padding: 20px;
  position: relative;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.15);
  padding: 48px;
  position: relative;
  z-index: 1;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}
.logo-section-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.main-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.4));
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%);
  filter: blur(20px);
  animation: pulseGlow 4s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.logo-text-center {
  text-align: center;
}

.logo-text-center h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #00350b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: #10b981;
}

.logo-text h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.logo-highlight {
  color: #10b981;
}

.logo-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.header-content {
  margin-top: 16px;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #64748b;
  font-size: 1rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.input-wrapper {
  position: relative;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1e293b;
  transition: all 0.2s ease;
  background: #f8fafc;
}

input:focus {
  outline: none;
  border-color: #10b981;
  background: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

input.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.02);
}

.input-error {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 6px;
}

.input-error svg {
  width: 14px;
  height: 14px;
}

/* Password Input */
.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #64748b;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #10b981;
  border-color: #10b981;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  color: #475569;
  font-size: 0.875rem;
}

.forgot-password {
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: #0da271;
  text-decoration: underline;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.875rem;
}

.error-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Submit Button */
.submit-btn {
  padding: 16px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 16px;
}

/* Register Link */
.register-link {
  text-align: center;
}

.register-link p {
  color: #64748b;
  font-size: 0.875rem;
}

.register-link a {
  color: #10b981;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link a:hover {
  color: #0da271;
  text-decoration: underline;
}

/* Verification Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.2);
}

.modal-body {
  padding: 32px;
  text-align: center;
}

.verification-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.modal-body p {
  color: #64748b;
  margin-bottom: 8px;
  line-height: 1.5;
}

.modal-subtext {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.modal-btn.primary {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border: none;
}

.modal-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.modal-btn.secondary {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.modal-btn.secondary:hover {
  background: rgba(100, 116, 139, 0.2);
}

/* Responsive Design */
@media (max-width: 640px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .logo-section {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .modal-content {
    padding: 0;
  }
  
  .modal-body {
    padding: 24px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>