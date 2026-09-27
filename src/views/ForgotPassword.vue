<template>
  <div class="login-container">
    <LanguageSwitcher style="position: fixed; top: 16px; right: 16px; z-index: 20" />
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Main Card -->
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo-section">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1>Cu-Scan</h1>
            <p class="logo-subtitle">{{ t('brandSubtitle') }}</p>
          </div>
        </div>
        
        <div class="header-content">
          <h2 class="login-title">{{ t('forgotHeroTitle') }}</h2>
          <p class="login-subtitle">{{ t('forgotHeroDescription') }}</p>
        </div>
      </div>

      <!-- Forgot Password Form -->
      <form @submit.prevent="resetPassword" class="login-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ t('emailAddress') }}
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

        <!-- Success Message -->
        <div v-if="success" class="success-message">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="success-content">
            <p class="success-title">{{ t('checkYourEmailBang') }}</p>
            <p class="success-text">{{ t('resetInstructionsSent') }} <strong>{{ email }}</strong></p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M12 16H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="!isSubmitting">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 13V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 9L12 4L7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 4V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ t('sendResetLink') }}
          </span>
          <span v-else>
            <div class="spinner"></div>
            {{ t('sending') }}
          </span>
        </button>

        <!-- Back to Login -->
        <div class="back-to-login">
          <router-link to="/login" class="back-link">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ t('backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useLanguage } from '../store/language'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { t } = useLanguage()

const email = ref('');
const isSubmitting = ref(false);
const success = ref(false);
const error = ref('');
const errors = reactive({
  email: ''
});

// Form validation
const validateForm = () => {
  let isValid = true;
  errors.email = '';
  error.value = '';

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    errors.email = t('emailRequired');
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    errors.email = t('validEmailRequired');
    isValid = false;
  }

  return isValid;
};

// Clear specific error
const clearError = (field) => {
  errors[field] = '';
  error.value = '';
  success.value = false;
};

// Handle password reset
const resetPassword = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  error.value = '';
  success.value = false;

  try {
    await sendPasswordResetEmail(auth, email.value);
    success.value = true;
    // Clear form after successful submission
    email.value = '';
  } catch {
    error.value = t('operationFailed');
    success.value = false;
  } finally {
    isSubmitting.value = false;
  }
};
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

/* Success Message */
.success-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  width: 24px;
  height: 24px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.success-content {
  flex: 1;
}

.success-title {
  font-weight: 600;
  color: #059669;
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.success-text {
  color: #047857;
  font-size: 0.75rem;
  line-height: 1.4;
}

.success-text strong {
  font-weight: 600;
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
  animation: slideIn 0.3s ease-out;
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

/* Back to Login */
.back-to-login {
  text-align: center;
  margin-top: 8px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-link:hover {
  background: rgba(16, 185, 129, 0.1);
  text-decoration: none;
}

.back-link svg {
  width: 16px;
  height: 16px;
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
  
  .login-title {
    font-size: 1.5rem;
  }
  
  .login-subtitle {
    font-size: 0.875rem;
  }
  
  .submit-btn {
    padding: 14px;
    font-size: 0.875rem;
  }
  
  .back-link {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    padding: 24px 20px;
  }
  
  .success-message,
  .error-message {
    padding: 12px;
  }
}
</style>
