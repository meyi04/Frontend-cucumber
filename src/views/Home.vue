<template>
  <div class="home-container">
    <!-- Animated Background Particles -->
    <div class="particles" ref="particlesRef"></div>
    
    <!-- Gradient Orbs -->
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    
    <div class="hero-section">
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-logo">
            <!-- Your Actual Logo -->
            <img src="/logo.png" alt="CucumberAI Logo" class="logo-image" />
            <span class="nav-logo-text">CUDICS<span class="highlight">AI</span></span>
          </div>
          
          <div class="nav-links">
            <button @click="openModal('features')" class="nav-link">
              {{ t('features') }}
            </button>
            <button @click="openModal('how-it-works')" class="nav-link">
              {{ t('howItWorks') }}
            </button>
            <button @click="openModal('research')" class="nav-link">
              {{ t('research') }}
            </button>
            
            <!-- Language Switcher -->
            <LanguageSwitcher />
            
            <button @click="goToDashboard" class="nav-cta">
              {{ t('getStarted') }}
              <svg viewBox="0 0 20 20" fill="none" class="arrow-icon">
                <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div class="hero-content">
        <!-- Hero Section -->
        <div class="hero-main">
          <div class="hero-badge">
            <span class="badge-text">{{ t('heroBadge') }}</span>
            <div class="badge-glow"></div>
          </div>
          
          <!-- Logo in Hero Section -->
          <div class="hero-logo-container">
            <img src="/logo.png" alt="CucumberAI" class="hero-logo" />
            <div class="logo-glow"></div>
          </div>
          
          <h1 class="hero-title">
            <span class="title-line">{{ t('heroTitle1') }}</span>
            <span class="title-line gradient-text">{{ t('heroTitle2') }}</span>
          </h1>
          
          <p class="hero-description">
            {{ t('heroDescription') }}
          </p>
          
          <div class="hero-actions">
            <button @click="goToDashboard" class="primary-btn">
              <svg viewBox="0 0 24 24" fill="none" class="btn-icon">
                <path d="M9 17L15 12L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ t('startDetection') }}
            </button>
            <button class="secondary-btn" @click="openModal('demo')">
              <svg viewBox="0 0 24 24" fill="none" class="btn-icon">
                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                      stroke="currentColor" stroke-width="1.5"/>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              {{ t('watchDemo') }}
            </button>
          </div>
          
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number" ref="stat1">0</div>
              <div class="stat-label">{{ t('imagesAnalyzed') }}</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-number" ref="stat2">0</div>
              <div class="stat-label">{{ t('detectionAccuracy') }}</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-number" ref="stat3">0</div>
              <div class="stat-label">{{ t('diseasesIdentified') }}</div>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="features-section">
          <div class="section-header">
            <div class="section-logo">
              <img src="/logo.png" alt="CucumberAI" class="section-logo-image" />
            </div>
            <h2 class="section-title">{{ t('whyChoose') }}<span class="highlight">{{ t('ai') }}</span></h2>
            <p class="section-subtitle">{{ t('cuttingEdge') }}</p>
          </div>
          
          <div class="features-panel">
            <div class="features-grid">
              <div class="feature-card" v-for="(feature, index) in features" :key="index" 
                   @mouseenter="activateCard(index)" @mouseleave="deactivateCard(index)">
                <div class="feature-card-inner">
                  <div class="feature-icon-wrapper">
                    <div class="feature-icon-backdrop"></div>
                    <div class="feature-icon">
                      <component :is="feature.icon" />
                    </div>
                  </div>
                  <h3 class="feature-title">{{ t(feature.titleKey) }}</h3>
                  <p class="feature-description">{{ t(feature.descKey) }}</p>
                  <div class="feature-hover-line"></div>
                </div>
                <div class="feature-glow" :class="{ 'active': activeCard === index }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <div class="cta-card">
            <div class="cta-logo">
              <img src="/logo.png" alt="CucumberAI" class="cta-logo-image" />
            </div>
            <div class="cta-content">
              <h2 class="cta-title">{{ t('ctaTitle') }}</h2>
              <p class="cta-description">
                {{ t('ctaDescription') }}
              </p>
              <button @click="goToDashboard" class="cta-btn">
                <span>{{ t('ctaButton') }}</span>
                <svg viewBox="0 0 20 20" fill="none" class="cta-arrow">
                  <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="cta-pattern"></div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-inner">
            <div class="footer-left">
              <div class="footer-logo">
                <img src="/logo.png" alt="CucumberAI" class="footer-logo-image" />
                <div>
                  <div class="brand-title">Cucumber<span class="highlight">AI</span></div>
                  <p class="footer-tagline">{{ t('tagline') }}</p>
                </div>
              </div>
            </div>

            <div class="footer-links-grid">
              <div class="link-column">
                <h4>{{ t('product') }}</h4>
                <button @click="openModal('features')" class="footer-link">{{ t('features') }}</button>
                <button @click="openModal('pricing')" class="footer-link">{{ t('pricing') }}</button>
                <button @click="openModal('api')" class="footer-link">{{ t('api') }}</button>
              </div>
              <div class="link-column">
                <h4>{{ t('resources') }}</h4>
                <button @click="openModal('documentation')" class="footer-link">{{ t('documentation') }}</button>
                <button @click="openModal('research')" class="footer-link">{{ t('research') }}</button>
                <button @click="openModal('blog')" class="footer-link">{{ t('blog') }}</button>
              </div>
              <div class="link-column">
                <h4>{{ t('company') }}</h4>
                <button @click="openModal('about')" class="footer-link">{{ t('navAbout') }}</button>
                <button @click="openModal('contact')" class="footer-link">{{ t('contact') }}</button>
                <button @click="openModal('careers')" class="footer-link">{{ t('careers') }}</button>
              </div>
            </div>

            <div class="footer-right">
              <h4>{{ t('stayUpdated') }}</h4>
              <p class="small">{{ t('subscribeText') }}</p>
              <form class="newsletter" @submit.prevent>
                <input type="email" :placeholder="t('emailPlaceholder')" aria-label="Email" />
                <button class="subscribe">{{ t('subscribe') }}</button>
              </form>
              <div class="socials">
                <button class="social-btn" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M22 5.92c-.63.28-1.3.47-2 .56.72-.43 1.27-1.1 1.53-1.9-.67.4-1.42.7-2.22.86A3.48 3.48 0 0015.5 4c-1.93 0-3.5 1.57-3.5 3.5 0 .27.03.53.09.78C8.28 8.1 5.1 6.13 3 3.19c-.3.52-.47 1.12-.47 1.76 0 1.22.62 2.3 1.57 2.93-.58-.02-1.13-.18-1.61-.44v.04c0 1.7 1.21 3.12 2.82 3.44-.29.08-.6.12-.92.12-.22 0-.44-.02-.65-.06.44 1.37 1.71 2.37 3.22 2.4A7 7 0 012 19.54 9.86 9.86 0 008.29 21c6.54 0 10.12-5.42 10.12-10.12v-.46c.7-.5 1.3-1.14 1.78-1.86-.64.28-1.33.47-2.04.56z" stroke="currentColor" stroke-width="0.8"/></svg>
                </button>
                <button class="social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M4 4h4v16H4zM6 4v16" stroke="currentColor" stroke-width="0.8"/><rect x="10" y="8" width="4" height="12" rx="1" stroke="currentColor" stroke-width="0.8"/><path d="M10 8a2 2 0 114 0" stroke="currentColor" stroke-width="0.8"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div class="bottom-left">© 2024 CucumberAI. {{ t('allRightsReserved') }}</div>
            <div class="bottom-right">
              <button class="bottom-link" @click="openModal('privacy')">{{ t('privacy') }}</button>
              <span>•</span>
              <button class="bottom-link" @click="openModal('terms')">{{ t('terms') }}</button>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Modal Component -->
    <teleport to="body" v-if="showModal">
      <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-container" :class="modalSize">
          <div class="modal-header">
            <h2 class="modal-title">{{ modalTitle }}</h2>
            <button @click="closeModal" class="modal-close">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-content">
            <!-- Features Modal Content -->
            <div v-if="currentModal === 'features'" class="features-modal-content">
              <div class="modal-hero">
                <div class="modal-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <h3>{{ t('modalFeatures') }}</h3>
                <p>{{ t('modalFeaturesSubtitle') }}</p>
              </div>
              
              <div class="modal-features-grid">
                <div class="modal-feature" v-for="(feature, index) in modalFeatures" :key="index">
                  <div class="modal-feature-icon">
                    <component :is="feature.icon" />
                  </div>
                  <div class="modal-feature-content">
                    <h4>{{ t(feature.titleKey) }}</h4>
                    <p>{{ t(feature.descKey) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- How It Works Modal Content -->
            <div v-else-if="currentModal === 'how-it-works'" class="steps-modal-content">
              <div class="modal-hero">
                <div class="modal-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" 
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <h3>{{ t('modalHowItWorks') }}</h3>
                <p>{{ t('modalHowItWorksSubtitle') }}</p>
              </div>
              
              <div class="steps-container">
                <div class="step" v-for="(step, index) in howItWorksSteps" :key="index">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">
                    <h4>{{ t(step.titleKey) }}</h4>
                    <p>{{ t(step.descKey) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Research Modal Content -->
            <div v-else-if="currentModal === 'research'" class="research-modal-content">
              <div class="modal-hero">
                <div class="modal-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" 
                          stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <h3>{{ t('modalResearch') }}</h3>
                <p>{{ t('modalResearchSubtitle') }}</p>
              </div>
              
              <div class="research-stats">
                <div class="research-stat">
                  <div class="stat-value">95%+</div>
                  <div class="stat-label">{{ t('researchAccuracy') }}</div>
                </div>
                <div class="research-stat">
                  <div class="stat-value">10,000+</div>
                  <div class="stat-label">{{ t('researchImages') }}</div>
                </div>
                <div class="research-stat">
                  <div class="stat-value">6+</div>
                  <div class="stat-label">{{ t('researchDiseases') }}</div>
                </div>
              </div>
              
              <div class="research-points">
                <div class="research-point" v-for="(point, index) in researchPoints" :key="index">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ t(point.key) }}</span>
                </div>
              </div>
            </div>

            <!-- Demo Modal Content -->
            <div v-else-if="currentModal === 'demo'" class="demo-modal-content">
              <div class="modal-hero">
                <div class="modal-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                          stroke="currentColor" stroke-width="1.5"/>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <h3>{{ t('modalDemo') }}</h3>
                <p>{{ t('modalDemoSubtitle') }}</p>
              </div>
              
              <div class="demo-placeholder">
                <div class="demo-video-placeholder">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                          stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <p>{{ t('demoVideoPlaceholder') }}</p>
                </div>
              </div>
              
              <div class="demo-steps">
                <h4>{{ t('demoOverview') }}</h4>
                <ol>
                  <li v-for="(step, index) in demoSteps" :key="index">{{ t(step) }}</li>
                </ol>
              </div>
            </div>

            <!-- Default Modal Content -->
            <div v-else class="default-modal-content">
              <div class="modal-hero">
                <div class="modal-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
                          stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <h3>{{ modalTitle }}</h3>
                <p>{{ t('comingSoon', { modal: modalTitle }) }}</p>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="goToDashboard" class="modal-action-btn">
              {{ t('getStarted') }}
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M4.16675 10H15.8334M15.8334 10L10.0001 4.16669M15.8334 10L10.0001 15.8334" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button @click="closeModal" class="modal-close-btn">{{ t('close') }}</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '../store/language'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const router = useRouter()
const { t } = useLanguage()
const particlesRef = ref(null)
const activeCard = ref(null)
const stat1 = ref(null)
const stat2 = ref(null)
const stat3 = ref(null)
const showModal = ref(false)
const currentModal = ref('')

// Features with translation keys
const features = [
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    },
    titleKey: 'feature1Title',
    descKey: 'feature1Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" 
                stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 12L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    },
    titleKey: 'feature2Title',
    descKey: 'feature2Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 17L15 12L9 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 14C19 15.105 19.895 16 21 16C22.105 16 23 15.105 23 14C23 12.895 22.105 12 21 12C19.895 12 19 12.895 19 14Z" 
                stroke="currentColor" stroke-width="1.5"/>
          <path d="M1 14C1 15.105 1.895 16 3 16C4.105 16 5 15.105 5 14C5 12.895 4.105 12 3 12C1.895 12 1 12.895 1 14Z" 
                stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    },
    titleKey: 'feature3Title',
    descKey: 'feature3Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12H15M12 9V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" 
                stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    },
    titleKey: 'feature4Title',
    descKey: 'feature4Desc'
  }
]

// Modal features with translation keys
const modalFeatures = [
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    titleKey: 'modalFeature1Title',
    descKey: 'modalFeature1Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    titleKey: 'modalFeature2Title',
    descKey: 'modalFeature2Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 17l4-4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    titleKey: 'modalFeature3Title',
    descKey: 'modalFeature3Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M14 2v6h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `
    },
    titleKey: 'modalFeature4Title',
    descKey: 'modalFeature4Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `
    },
    titleKey: 'modalFeature5Title',
    descKey: 'modalFeature5Desc'
  },
  {
    icon: {
      template: `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M19 11H5M19 11a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    },
    titleKey: 'modalFeature6Title',
    descKey: 'modalFeature6Desc'
  }
]

// How it works steps with translation keys
const howItWorksSteps = [
  {
    titleKey: 'step1Title',
    descKey: 'step1Desc'
  },
  {
    titleKey: 'step2Title',
    descKey: 'step2Desc'
  },
  {
    titleKey: 'step3Title',
    descKey: 'step3Desc'
  },
  {
    titleKey: 'step4Title',
    descKey: 'step4Desc'
  }
]

// Research points
const researchPoints = [
  { key: 'researchPoint1' },
  { key: 'researchPoint2' },
  { key: 'researchPoint3' }
]

// Demo steps
const demoSteps = [
  'demoStep1',
  'demoStep2',
  'demoStep3',
  'demoStep4'
]

const modalTitles = {
  'features': 'modalFeatures',
  'how-it-works': 'modalHowItWorks',
  'research': 'modalResearch',
  'demo': 'modalDemo',
  'pricing': 'modalPricing',
  'api': 'modalAPI',
  'documentation': 'modalDocumentation',
  'blog': 'modalBlog',
  'about': 'modalAbout',
  'contact': 'modalContact',
  'careers': 'modalCareers'
}

const modalSize = computed(() => {
  const largeModals = ['features', 'how-it-works', 'research', 'demo']
  return largeModals.includes(currentModal.value) ? 'modal-large' : 'modal-medium'
})

const modalTitle = computed(() => {
  return t(modalTitles[currentModal.value] || 'Information')
})

const goToDashboard = () => {
  router.push('/login')
}

const activateCard = (index) => {
  activeCard.value = index
}

const deactivateCard = () => {
  activeCard.value = null
}

const openModal = (modalType) => {
  currentModal.value = modalType
  showModal.value = true
  document.body.classList.add('modal-open')
  document.documentElement.classList.add('modal-open')
}

const closeModal = () => {
  showModal.value = false
  document.body.classList.remove('modal-open')
  document.documentElement.classList.remove('modal-open')
}

const animateStats = () => {
  const targets = [1000, 95, 10]
  const durations = [2000, 1500, 1000]
  
  targets.forEach((target, index) => {
    const element = index === 0 ? stat1.value : index === 1 ? stat2.value : stat3.value
    if (!element) return
    
    let current = 0
    const increment = target / (durations[index] / 16)
    
    const updateCount = () => {
      current += increment
      if (current < target) {
        element.textContent = Math.floor(current)
        requestAnimationFrame(updateCount)
      } else {
        element.textContent = target + (index === 1 ? '%' : index === 2 ? '+' : '+')
      }
    }
    
    updateCount()
  })
}

onMounted(() => {
  // Create particle effect
  if (particlesRef.value) {
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.cssText = `
        --x: ${Math.random() * 100}%;
        --y: ${Math.random() * 100}%;
        --delay: ${Math.random() * 5}s;
        --duration: ${10 + Math.random() * 10}s;
      `
      particlesRef.value.appendChild(particle)
    }
  }
  
  animateStats()
  
  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showModal.value) {
      closeModal()
    }
  })
  // hide horizontal overflow site-wide for Home view
  document.body.style.overflowX = 'hidden'
  document.documentElement.style.overflowX = 'hidden'
})

onUnmounted(() => {
  // restore body overflow styles when leaving Home
  document.body.style.overflowX = ''
  document.documentElement.style.overflowX = ''
  document.body.style.overflowY = ''
  document.body.classList.remove('modal-open')
  document.documentElement.classList.remove('modal-open')
})
</script>



<style scoped>
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.home-container {
  min-height: 100vh;
  width:100%;
  background: #ffffff;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin:0px;
  padding-top: 80px;
}

/* Animated Background Elements */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: float var(--duration) var(--delay) linear infinite;
  top: var(--y);
  left: var(--x);
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.2;
  z-index: 1;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #10b981, transparent 70%);
  top: -200px;
  left: -200px;
  animation: pulse 8s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation: pulse 12s ease-in-out infinite reverse;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #8b5cf6, transparent 70%);
  top: 50%;
  right: 10%;
  animation: pulse 10s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(10px);
background: linear-gradient(135deg, 
    rgba(20, 184, 166, 0.15) 0%, 
    rgba(13, 148, 136, 0.25) 50%, 
    rgba(20, 184, 166, 0.15) 100%
);
background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.08) 0%, 
    rgba(16, 185, 129, 0.18) 50%, 
    rgba(16, 185, 129, 0.08) 100%
);
backdrop-filter: blur(25px);
-webkit-backdrop-filter: blur(25px);
border: 1px solid rgba(16, 185, 129, 0.2);
box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.nav-content {
  max-width: 1200px;
  width: min(1200px, 100%);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3));
  transition: transform 0.3s ease;
}

.nav-logo:hover .logo-image {
  transform: scale(1.1) rotate(5deg);
}

.nav-logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(0, 31, 12);
}

.highlight {
  color: #10b981;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: white;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-cta {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #c0ebcb, #059669);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

/* Hero Section */
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-main {
  text-align: center;
  padding: 4rem 0 6rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 50px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.badge-text {
  color: #10b981;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 2;
}

.badge-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 50%);
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-logo-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
}

.hero-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.4));
  position: relative;
  z-index: 2;
  animation: floatLogo 6s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%);
  filter: blur(20px);
  animation: pulseGlow 4s ease-in-out infinite;
}

@keyframes floatLogo {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.hero-title {
  font-size: clamp(2rem, 4vw + 1rem, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  
}

.title-line {
  display: block;
  color: rgb(0, 34, 5);
}

.gradient-text {
  background: linear-gradient(135deg, #10b981, #fff01d, #006905);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 8s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-description {
  font-size: clamp(1rem, 1.2vw + 0.6rem, 1.25rem);
  color: #94a3b8;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.primary-btn, .secondary-btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.primary-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.secondary-btn {
background: #a6f78e;
  color: rgb(0, 0, 0);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: clamp(1.5rem, 5vw, 4rem);
  padding-top: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.05);
}

/* Features Section */
.features-section {
  padding: 10rem 0 6rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-logo {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
}

.section-logo-image {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(0 2px 12px rgba(16, 185, 129, 0.3));
}

.section-title {
  font-size: clamp(1.75rem, 3vw + 1rem, 3rem);
  font-weight: 800;
  color: #062e1f;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #94a3b8;
  font-size: 1.125rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.25rem;
  margin-top: 4rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.features-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,255,250,0.95));
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 14px 40px rgba(4,10,6,0.12);
  border: 1px solid rgba(6,60,40,0.06);
}

.feature-card {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(6,60,40,0.08);
  border-radius: 16px;
  padding: 2rem;
  transition: transform 0.28s cubic-bezier(.2,.9,.3,1), box-shadow 0.28s;
  cursor: pointer;
  overflow: hidden;
}

.feature-card-inner {
  position: relative;
  z-index: 2;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(16, 185, 129, 0.22);
  box-shadow: 0 14px 36px rgba(4,10,6,0.12);
}

.feature-icon-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  margin-bottom: 1.25rem;
}

.feature-icon-backdrop {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  transform: rotate(45deg);
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon-backdrop {
  transform: rotate(90deg);
  background: rgba(16, 185, 129, 0.2);
}

.feature-icon {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

.feature-icon svg { width:44px; height:44px }

.feature-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #07251a;
  margin-bottom: 0.6rem;
}

.feature-description {
  color: #244036;
  line-height: 1.6;
  opacity: 0.96;
}

.feature-hover-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

.feature-card:hover .feature-hover-line {
  width: 100%;
}

.feature-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.10), transparent 35%);
  opacity: 0;
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.feature-glow.active {
  opacity: 0.22;
  transform: translateY(-4px);
}

/* CTA Section */
.cta-section {
  padding: 4rem 0;
}

.cta-card {
  position: relative;
  background: linear-gradient(135deg, rgba(0, 122, 82, 0.1), rgba(22, 177, 60, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 24px;
  padding: 4rem;
  text-align: center;
  overflow: hidden;
}

.cta-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
}

.cta-logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.4));
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-title {
  font-size: clamp(1.75rem, 2.5vw + 1rem, 2.5rem);
  font-weight: 800;
  color: rgb(0, 61, 5);
  margin-bottom: 1rem;
}

.cta-description {
  color: #747474;
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-btn {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
}

.cta-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.cta-btn:hover .cta-arrow {
  transform: translateX(4px);
}

.cta-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 25% 25%, #10b981 2px, transparent 3px),
    radial-gradient(circle at 75% 75%, #3b82f6 2px, transparent 3px);
  background-size: 60px 60px;
  animation: patternFloat 20s linear infinite;
}

@keyframes patternFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(60px); }
}

/* Footer */
.footer {
  padding: 4rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 4rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1.2fr 1.4fr 1fr;
  gap: 3rem;
  align-items: start;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
}

.footer-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.newsletter {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.newsletter input {
  flex: 1 1 180px;
  min-width: 0;
}

.subscribe {
  white-space: nowrap;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.footer-logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3));
}

.footer-tagline {
  color: #94a3b8;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-group h4 {
  color: white;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.link-group a {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.copyright, .footer-meta {
  color: #64748b;
  font-size: 0.875rem;
}

.footer-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }

  .hero-content {
    padding: 1.5rem;
  }

  .features-section {
    padding: 8rem 0 5rem;
  }

  .cta-card {
    padding: 3rem;
  }

  .hero-title {
    font-size: 3rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-links-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem 1.25rem;
  }

  .nav-content {
    gap: 1rem;
  }

  .nav-links {
    display: none;
  }
  
  .nav-cta {
    padding: 0.65rem 1rem;
  }

  .hero-content {
    padding: 1.25rem;
  }

  .hero-main {
    padding: 3rem 0 4rem;
  }

  .hero-logo-container {
    width: 100px;
    height: 100px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .primary-btn, .secondary-btn {
    width: 100%;
    justify-content: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 2rem;
    padding-top: 2.5rem;
  }
  
  .stat-divider {
    display: none;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }

  .features-panel {
    padding: 1.5rem;
  }

  .features-section {
    padding: 6rem 0 4rem;
  }
  
  .cta-card {
    padding: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }

  .cta-description {
    max-width: 100%;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-inner {
    padding: 0 1.25rem;
  }

  .footer-links-grid {
    grid-template-columns: 1fr;
  }

  .newsletter {
    flex-direction: column;
  }

  .subscribe {
    width: 100%;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    gap: 0.6rem;
  }

  .primary-btn, .secondary-btn {
    padding: 0.9rem 1.25rem;
  }

  .hero-logo-container {
    width: 80px;
    height: 80px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2.25rem;
  }

  .hero-description {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .nav-logo-text {
    font-size: 1.25rem;
  }
  
  .cta-logo {
    width: 60px;
    height: 60px;
  }

  .cta-title {
    font-size: 1.75rem;
  }

  .footer-tagline {
    font-size: 0.9rem;
  }

  .footer-bottom {
    padding-top: 1.5rem;
  }
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Container */
.modal-container {
  background: linear-gradient(135deg, #7df7a2 0%, #f3f3f3 100%);
  border: 1px solid rgba(135, 141, 135, 0.1);
  border-radius: 24px;
  max-width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-large {
  width: 800px;
}

.modal-medium {
  width: 600px;
}

/* Modal Header */
.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(13, 15, 14, 0.8);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* Modal Content */
.modal-content {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Modal Hero */
.modal-hero {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #01291c;
}

.modal-icon svg {
  width: 32px;
  height: 32px;
}

.modal-hero h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(17, 16, 16);
  margin-bottom: 0.5rem;
}

.modal-hero p {
  color: #333941;
  font-size: 1rem;
}

/* Features Modal */
.modal-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.modal-feature {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.modal-feature:hover {
  border-color: rgba(16, 185, 129, 0.2);
  background: rgba(16, 185, 129, 0.05);
}

.modal-feature-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
}

.modal-feature-icon svg {
  width: 20px;
  height: 20px;
}

.modal-feature-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(17, 17, 17);
  margin-bottom: 0.5rem;
}

.modal-feature-content p {
  color: #080808;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* How It Works Modal */
.steps-container {
  margin-top: 2rem;
}

.step {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.step:last-child {
  border-bottom: none;
}

.step-number {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #10b981, #002c0f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.125rem;
}

.step-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(2, 2, 2);
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #4d5258;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Research Modal */
.research-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
}

.research-stat {
  text-align: center;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.research-points {
  margin-top: 2rem;
}

.research-point {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.research-point:last-child {
  border-bottom: none;
}

.research-point svg {
  width: 20px;
  height: 20px;
  color: #10b981;
  flex-shrink: 0;
}

.research-point span {
  color: #cbd5e1;
  font-size: 0.875rem;
}

/* Demo Modal */
.demo-placeholder {
  margin: 2rem 0;
}

.demo-video-placeholder {
  background: rgba(0, 0, 0, 0.3);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.demo-video-placeholder svg {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
}

.demo-steps {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.demo-steps h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
}

.demo-steps ol {
  padding-left: 1.5rem;
  color: #cbd5e1;
}

.demo-steps li {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: rgba(15, 23, 42, 0.8);
}

.modal-action-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.modal-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.modal-action-btn svg {
  width: 16px;
  height: 16px;
}

.modal-close-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Update Navigation Links */
.nav-link {
  background: none;
  border: none;
  color: #001d02;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #10b981;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Update Footer Links */
.footer-link {
  background: none;
  border: none;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0;
  text-align: left;
  display: block;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #10b981;
}

/* Responsive Design for Modal */
@media (max-width: 768px) {
  .modal-large,
  .modal-medium {
    width: 95%;
  }
  
  .modal-header {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }
  
  .modal-action-btn,
  .modal-close-btn {
    width: 100%;
    justify-content: center;
  }
  
  .modal-features-grid {
    grid-template-columns: 1fr;
  }
  
  .research-stats {
    grid-template-columns: 1fr;
  }
  
  .steps-container .step {
    padding: 1rem;
  }
}

/* Prevent body scroll when modal is open */
body.modal-open {
  overflow: hidden;
}
</style>

<style>
/* Force-hide horizontal scroll across the app while on Home */
html, body, #app {
  overflow-x: hidden !important;
  margin: 0;
  padding: 0;
}

/* When modal is open, prevent page scrolling (leave modal scrolling active) */
body.modal-open, html.modal-open {
  overflow: hidden !important;
}

/* Ensure the fixed navbar doesn't create extra horizontal scroll */
.navbar {
  left: 0;
  right: 0;
}
</style>
