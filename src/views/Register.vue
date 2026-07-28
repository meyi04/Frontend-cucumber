<template>
  <div class="register-container">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Main Card -->
    <div class="register-card">
      <!-- Header -->
      <div class="register-header">
  <!-- Animated Background Elements -->
  <div class="register-bg-shapes">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
  </div>
  
  <div class="logo-section-enhanced">
    <!-- Logo with Container -->
    <div class="logo-container">
      <div class="logo-frame">
        <img src="/logo.png" alt="CucumberAI" class="main-logo" />
      </div>
      <div class="logo-glow-effect"></div>
    </div>
    
    <div class="logo-text-enhanced">
      <h1>Cucumber<span class="logo-highlight">AI</span></h1>
      <div class="logo-tagline">
        <span class="tagline-text">Intelligent Plant Disease Detection</span>
        <div class="tagline-line"></div>
      </div>
    </div>
  </div>
  
  <div class="header-content-enhanced">
    <h2 class="register-title">Create Your Account</h2>
    <p class="register-subtitle">Join thousands of farmers using AI for crop protection</p>
    
    <div class="register-stats">
      <div class="stat">
        <span class="stat-number">95%</span>
        <span class="stat-label">Accuracy</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-number">24/7</span>
        <span class="stat-label">Analysis</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <span class="stat-number">Free</span>
        <span class="stat-label">To Start</span>
      </div>
    </div>
  </div>
</div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Name Field -->
        <div class="form-group">
          <label for="name" class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Full Name
          </label>
          <div class="input-wrapper">
            <input
              v-model="name"
              type="text"
              id="name"
              required
              placeholder="John Doe"
              :class="{ 'error': errors.name }"
              @input="clearError('name')"
            />
            <div v-if="errors.name" class="input-error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>{{ errors.name }}</span>
            </div>
          </div>
        </div>

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
                placeholder="Create a password"
                :class="{ 'error': errors.password }"
                @input="clearError('password'); validatePassword()"
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

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 8.5C17 7.57174 17 7.1076 16.9487 6.75159C16.3625 3.18519 13.2715 1.13907 9.78009 1.92705C9.28879 2.03956 8.78912 2.24283 8 2.55937M7 22H17C18.8856 22 19.8284 22 20.4142 21.4142C21 20.8284 21 19.8856 21 18C21 16.1144 21 15.1716 20.4142 14.5858C19.8284 14 18.8856 14 17 14H7C5.11438 14 4.17157 14 3.58579 14.5858C3 15.1716 3 16.1144 3 18C3 19.8856 3 20.8284 3.58579 21.4142C4.17157 22 5.11438 22 7 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Confirm Password
          </label>
          <div class="input-wrapper">
            <div class="password-input">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                required
                placeholder="Confirm your password"
                :class="{ 'error': errors.confirmPassword }"
                @input="clearError('confirmPassword'); validatePassword()"
              />
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
              >
                <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none">
                  <path d="M2 12C2 12 5 4 12 4C19 4 22 12 22 12C22 12 19 20 12 20C5 20 2 12 2 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M10.7429 5.09232C11.1494 5.03223 11.5686 5 12.0004 5C17.1054 5 20.4553 9.50484 21.5807 11.2868C21.7169 11.5025 21.785 11.6103 21.8231 11.7767C21.8518 11.9016 21.8517 12.0987 21.8231 12.2236C21.7849 12.3899 21.7164 12.4985 21.5792 12.7156C21.2793 13.1901 20.8222 13.8571 20.2165 14.5805M6.72432 6.71504C4.56225 8.1817 3.09445 10.2194 2.42111 11.2853C2.28428 11.5019 2.21587 11.6102 2.17774 11.7765C2.1491 11.9014 2.14909 12.0984 2.17771 12.2234C2.21583 12.3897 2.28393 12.4975 2.42013 12.7132C3.54554 14.4952 6.89541 19 12.0004 19C14.0588 19 15.8319 18.2676 17.2888 17.2766M3.00042 3L21.0004 21M9.8791 9.87868C9.3362 10.4216 9.00042 11.1716 9.00042 12C9.00042 13.6569 10.3436 15 12.0004 15C12.8288 15 13.5788 14.6642 14.1217 14.1213" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="input-error">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>{{ errors.confirmPassword }}</span>
            </div>
          </div>
        </div>

        <!-- Password Strength -->
        <div v-if="password" class="password-strength">
          <div class="strength-header">
            <span>Password Strength:</span>
            <span class="strength-label" :class="passwordStrength.class">
              {{ passwordStrength.label }}
            </span>
          </div>
          <div class="strength-meter">
            <div 
              class="strength-bar" 
              :class="passwordStrength.class"
              :style="{ width: passwordStrength.percent + '%' }"
            ></div>
          </div>
          <div class="strength-requirements">
            <div 
              class="requirement" 
              v-for="(req, index) in passwordRequirements" 
              :key="index"
              :class="{ 'met': req.met }"
            >
              <svg v-if="req.met" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 12L11 15L16 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 12L16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ req.text }}
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="terms-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptTerms" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">
              I agree to the 
              <a href="#" class="terms-link">Terms of Service</a> 
              and 
              <a href="#" class="terms-link">Privacy Policy</a>
            </span>
          </label>
          <div v-if="errors.acceptTerms" class="input-error">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>{{ errors.acceptTerms }}</span>
          </div>
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
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09408 12.5922C7.96042 11.7616 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M12 8H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Create Account
          </span>
          <span v-else>
            <div class="spinner"></div>
            Creating account...
          </span>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Login Link -->
        <div class="login-link">
          <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registration Successful!</h3>
          <button @click="showSuccessModal = false" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 12L11 16L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h4>Check Your Email</h4>
          <p>We've sent a verification link to <strong>{{ email }}</strong></p>
          <p class="modal-subtext">Please verify your email to activate your account and start using CucumberAI.</p>
          <div class="modal-actions">
            <button @click="goToLogin" class="modal-btn primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M11 16L15 12M15 12L11 8M15 12H3M21 12C21 16.9706 16.9706 21 12 21C9.34784 21 6.8043 19.9464 4.92893 18.0711C3.05357 16.1957 2 13.6522 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20.0057 11.1667 20.0057 11.8333 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Go to Login
            </button>
            <button @click="resendVerification" class="modal-btn secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M1 4V10H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9C19.9828 7.56678 19.1209 6.2854 17.9845 5.27542C16.8482 4.26543 15.4745 3.55976 14 3.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.51 15C4.0172 16.4332 4.87907 17.7146 6.01547 18.7246C7.15186 19.7346 8.52549 20.4402 10 20.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Resend Email
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { auth } from '../firebase'; // Adjust path as needed

const router = useRouter()
const authStore = useAuthStore()

// Form data
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)

// Form errors
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

// Password requirements
const passwordRequirements = reactive([
  { text: 'At least 8 characters', met: false },
  { text: 'Contains uppercase letter', met: false },
  { text: 'Contains lowercase letter', met: false },
  { text: 'Contains number', met: false },
  { text: 'Contains special character', met: false }
])

// Initialize auth
onMounted(() => {
  authStore.initializeAuth()
  authStore.clearError()
})

// Password strength calculation
const passwordStrength = computed(() => {
  if (!password.value) return { label: 'None', percent: 0, class: 'none' }
  
  let score = 0
  const requirements = passwordRequirements
  
  // Check each requirement
  requirements[0].met = password.value.length >= 8
  requirements[1].met = /[A-Z]/.test(password.value)
  requirements[2].met = /[a-z]/.test(password.value)
  requirements[3].met = /\d/.test(password.value)
  requirements[4].met = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
  
  // Calculate score
  score = requirements.filter(req => req.met).length
  
  // Determine strength level
  if (score <= 2) return { label: 'Weak', percent: 40, class: 'weak' }
  if (score <= 4) return { label: 'Good', percent: 70, class: 'good' }
  return { label: 'Strong', percent: 100, class: 'strong' }
})

// Password validation
const validatePassword = () => {
  errors.password = ''
  errors.confirmPassword = ''
  
  if (password.value && password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }
  
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
  }
}

// Form validation
const validateForm = () => {
  let isValid = true
  
  // Clear all errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Name validation
  if (!name.value.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }
  
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
  
  // Confirm password validation
  if (!confirmPassword.value) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  // Terms validation
  if (!acceptTerms.value) {
    errors.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }
  
  return isValid
}

// Clear specific error
const clearError = (field) => {
  errors[field] = ''
  if (field !== 'password') {
    authStore.clearError()
  }
}

// Handle registration
const handleRegister = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  const userData = {
    displayName: name.value,
    createdAt: new Date().toISOString()
  }

  const result = await authStore.register(email.value, password.value, userData)

  if (result.success) {
    showSuccessModal.value = true
  }

  isSubmitting.value = false
}

// Go to login
const goToLogin = () => {
  showSuccessModal.value = false
  router.push('/login')
}

// Resend verification email
const resendVerification = async () => {
  const result = await authStore.resendVerificationEmail(email.value)
  if (result.success) {
    // Show success toast or message
    console.log('Verification email resent!')
  }
}
</script>

<style scoped>
/* Enhanced CSS for Register Header */
.register-header {
  position: relative;
  text-align: center;
  padding: 3rem 0;
  overflow: hidden;
}

.register-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.1;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #10b981, transparent 70%);
  top: 10%;
  left: 10%;
  animation: floatShape 20s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
  bottom: 20%;
  right: 10%;
  animation: floatShape 15s ease-in-out infinite reverse;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.logo-section-enhanced {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.logo-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.logo-frame {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);
}

.main-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.6));
  animation: logoPulse 4s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.logo-glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%);
  filter: blur(25px);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.logo-text-enhanced h1 {
  font-size: 2.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.logo-tagline {
  margin-top: 0.75rem;
  position: relative;
  display: inline-block;
}

.tagline-text {
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.tagline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
  transform: translateY(-50%);
}

.header-content-enhanced {
  position: relative;
  z-index: 2;
}

.register-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.register-subtitle {
  color: #cbd5e1;
  font-size: 1.125rem;
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.register-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat {
  text-align: center;
  min-width: 80px;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-title {
    font-size: 1.75rem;
  }
  
  .register-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .register-stats {
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .stat-divider {
    display: none;
  }
  
  .logo-text-enhanced h1 {
    font-size: 2rem;
  }
}
.register-container {
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

.register-card {
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
.register-header {
  text-align: center;
  margin-bottom: 40px;
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

.register-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.register-subtitle {
  color: #64748b;
  font-size: 1rem;
}

/* Form */
.register-form {
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

/* Password Strength */
.password-strength {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.strength-label {
  font-weight: 600;
}

.strength-label.none {
  color: #94a3b8;
}

.strength-label.weak {
  color: #ef4444;
}

.strength-label.good {
  color: #f59e0b;
}

.strength-label.strong {
  color: #10b981;
}

.strength-meter {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 12px;
}

.strength-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.strength-bar.none {
  background: #94a3b8;
}

.strength-bar.weak {
  background: #ef4444;
}

.strength-bar.good {
  background: #f59e0b;
}

.strength-bar.strong {
  background: #10b981;
}

.strength-requirements {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.requirement.met {
  color: #10b981;
}

.requirement svg {
  width: 14px;
  height: 14px;
}

/* Terms and Conditions */
.terms-group {
  margin-top: 8px;
}

.terms-link {
  color: #10b981;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
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

/* Login Link */
.login-link {
  text-align: center;
}

.login-link p {
  color: #64748b;
  font-size: 0.875rem;
}

.login-link a {
  color: #10b981;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: #0da271;
  text-decoration: underline;
}

/* Success Modal */
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

.success-icon {
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
  .register-card {
    padding: 32px 24px;
  }
  
  .logo-section {
    flex-direction: column;
    text-align: center;
    gap: 8px;
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