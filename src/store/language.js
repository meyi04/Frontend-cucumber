// store/language.js
import { ref, computed } from 'vue'

// Available languages
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  },
  tl: {
    code: 'tl',
    name: 'Tagalog',
    flag: '🇵🇭',
    dir: 'ltr'
  }
  // Add more languages as needed
}

// Language translations
export const translations = {
  en: {
    // In your store/language.js, add these to the 'en' section:
    // In your store/language.js, add to the 'en' section:
    dashboard: 'Dashboard',
    uploadImage: 'Upload Image',
    history: 'History',
    diseaseInfo: 'Disease Info',
    profile: 'Profile',
    myProfile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    user: 'User',

    // Add to the 'tl' section (Tagalog):
    dashboard: 'Dashboard',
    uploadImage: 'Mag-upload ng Larawan',
    history: 'Kasaysayan',
    diseaseInfo: 'Impormasyon ng Sakit',
    profile: 'Profile',
    myProfile: 'Aking Profile',
    settings: 'Mga Setting',
    logout: 'Mag-logout',
    user: 'Gumagamit',

    // Dashboard Page
    dashboardTitle: 'Dashboard Overview',
    dashboardSubtitle: 'Real-time insights and performance metrics',
    totalAnalyzed: 'Total Leaves Analyzed',
    healthyPlants: 'Healthy Plants',
    infectedPlants: 'Infected Plants',
    modelAccuracy: 'Model Accuracy',
    systemStatus: 'System Status',
    liveMonitoring: 'Live monitoring & performance metrics',
    online: 'Online',
    offline: 'Offline',
    mlModel: 'ML Model',
    operational: 'Operational',
    lastUpdate: 'Last Update',
    queue: 'Queue',
    pending: '{count} pending',
    avgProcessing: 'Avg. Processing',
    locale: 'en-US', // For date formatting

    // Add these to the 'tl' section (Tagalog):

    // Dashboard Page
    dashboardTitle: 'Dashboard Pangkalahatang-ideya',
    dashboardSubtitle: 'Real-time na insights at performance metrics',
    totalAnalyzed: 'Kabuuang Dahong Nasuri',
    healthyPlants: 'Malulusog na Halaman',
    infectedPlants: 'May Sakit na Halaman',
    modelAccuracy: 'Accuracy ng Modelo',
    systemStatus: 'Katayuan ng System',
    liveMonitoring: 'Live monitoring at performance metrics',
    online: 'Online',
    offline: 'Offline',
    mlModel: 'ML Modelo',
    operational: 'Operational',
    lastUpdate: 'Huling Update',
    queue: 'Pila',
    pending: '{count} nakapila',
    avgProcessing: 'Avg. Processing',
    locale: 'en-PH', // For date formatting (you can also use 'tl-PH' if available)
    // Common
    appName: 'Cucumber Disease Detection',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    done: 'Done',

    // Navigation
    navHome: 'Home',
    navUpload: 'Upload',
    navHistory: 'History',
    navAbout: 'About',
    navProfile: 'Profile',
    navLogout: 'Logout',
    navLogin: 'Login',
    navRegister: 'Register',
    features: 'Features',
    howItWorks: 'How It Works',
    research: 'Research',
    getStarted: 'Get Started',

    // Hero Section
    heroBadge: 'AI-Powered Agriculture',
    heroTitle1: 'Smart Detection for',
    heroTitle2: 'Healthy Cucumbers',
    heroDescription: 'Advanced deep learning system for early detection and diagnosis of cucumber plant diseases. Upload images, get instant AI analysis, and protect your crops with 95% accuracy.',
    startDetection: 'Start Detection',
    watchDemo: 'Watch Demo',
    imagesAnalyzed: 'Images Analyzed',
    detectionAccuracy: 'Detection Accuracy',
    diseasesIdentified: 'Diseases Identified',

    // Features Section
    whyChoose: 'Why Choose Cucumber',
    ai: 'AI',
    cuttingEdge: 'Cutting-edge technology for modern agriculture',

    // Feature Cards
    feature1Title: 'Advanced AI Models',
    feature1Desc: 'State-of-the-art deep learning algorithms with 95%+ accuracy',
    feature2Title: 'Real-time Analysis',
    feature2Desc: 'Get instant results and actionable insights within seconds',
    feature3Title: 'Multi-Disease Detection',
    feature3Desc: 'Identify 10+ common cucumber diseases with precision',
    feature4Title: 'Prevention Tips',
    feature4Desc: 'Get expert recommendations for disease prevention',

    // CTA Section
    ctaTitle: 'Ready to Protect Your Crops?',
    ctaDescription: 'Join hundreds of farmers and agricultural experts using CucumberAI for disease prevention.',
    ctaButton: 'Start Free Analysis',

    // Footer
    product: 'Product',
    pricing: 'Pricing',
    api: 'API',
    resources: 'Resources',
    documentation: 'Documentation',
    blog: 'Blog',
    company: 'Company',
    contact: 'Contact',
    careers: 'Careers',
    stayUpdated: 'Stay updated',
    subscribeText: 'Subscribe for product updates and research news.',
    emailPlaceholder: 'Your email',
    subscribe: 'Subscribe',
    allRightsReserved: 'All rights reserved.',
    privacy: 'Privacy',
    terms: 'Terms',

    // Modal Titles
    modalFeatures: 'Features',
    modalHowItWorks: 'How It Works',
    modalResearch: 'Research & Development',
    modalDemo: 'Watch Demo',
    modalPricing: 'Pricing Plans',
    modalAPI: 'API Documentation',
    modalDocumentation: 'Documentation',
    modalBlog: 'Blog & Updates',
    modalAbout: 'About Us',
    modalContact: 'Contact Us',
    modalCareers: 'Careers',

    // Modal Content
    modalFeaturesSubtitle: 'Everything you need for effective cucumber disease management',
    modalHowItWorksSubtitle: 'Simple steps to protect your crops',
    modalResearchSubtitle: 'Backed by scientific research and continuous innovation',
    modalDemoSubtitle: 'See how CucumberAI works in action',

    // Modal Features
    modalFeature1Title: 'AI-Powered Detection',
    modalFeature1Desc: '95%+ accuracy with deep learning models',
    modalFeature2Title: 'Real-time Analysis',
    modalFeature2Desc: 'Results in under 2 seconds',
    modalFeature3Title: 'Multi-Disease Detection',
    modalFeature3Desc: 'Identify 10+ cucumber diseases',
    modalFeature4Title: 'Detailed Reports',
    modalFeature4Desc: 'PDF reports with treatment plans',
    modalFeature5Title: 'Mobile App',
    modalFeature5Desc: 'iOS & Android support',
    modalFeature6Title: 'Batch Processing',
    modalFeature6Desc: 'Upload multiple images at once',

    // How It Works Steps
    step1Title: 'Upload Image',
    step1Desc: 'Take or upload a clear photo of cucumber leaves',
    step2Title: 'AI Analysis',
    step2Desc: 'Our deep learning model analyzes the image in seconds',
    step3Title: 'Get Diagnosis',
    step3Desc: 'Receive detailed disease identification and severity',
    step4Title: 'Treatment Plan',
    step4Desc: 'Get expert recommendations for treatment and prevention',

    // Research Modal
    researchAccuracy: 'Detection Accuracy',
    researchImages: 'Training Images',
    researchDiseases: 'Diseases Detected',
    researchPoint1: 'Published in Agricultural AI Journals',
    researchPoint2: 'Collaboration with Agricultural Universities',
    researchPoint3: 'Continuous Model Improvements',

    // Demo Modal
    demoVideoPlaceholder: 'Demo video will play here',
    demoOverview: 'Demo Overview',
    demoStep1: 'Upload cucumber leaf image',
    demoStep2: 'AI analysis in real-time',
    demoStep3: 'Get detailed diagnosis report',
    demoStep4: 'View treatment recommendations',

    // Default Modal
    comingSoon: 'Content for {modal} is coming soon!',

    // Modal Footer
    getStarted: 'Get Started',
    close: 'Close',

    // Footer Tagline
    tagline: 'Intelligent agriculture solutions for healthier crops',
  },

  tl: {
    // Common
    appName: 'Pag-detect ng Sakit sa Pipino',
    loading: 'Naglo-load...',
    error: 'Error',
    success: 'Matagumpay',
    save: 'I-save',
    cancel: 'Kanselahin',
    delete: 'Burahin',
    confirm: 'Kumpirmahin',
    back: 'Bumalik',
    next: 'Susunod',
    done: 'Tapos',

    // Navigation
    navHome: 'Bahay',
    navUpload: 'Mag-upload',
    navHistory: 'Kasaysayan',
    navAbout: 'Tungkol',
    navProfile: 'Profile',
    navLogout: 'Mag-logout',
    navLogin: 'Mag-login',
    navRegister: 'Magrehistro',
    features: 'Mga Tampok',
    howItWorks: 'Paano Ito Gumagana',
    research: 'Pananaliksik',
    getStarted: 'Magsimula',

    // Hero Section
    heroBadge: 'Agrikultura na Pinapagana ng AI',
    heroTitle1: 'Matalinong Pag-detect para sa',
    heroTitle2: 'Malulusog na mga Pipino',
    heroDescription: 'Advanced deep learning system para sa maagang pag-detect at diagnosis ng mga sakit sa halamang pipino. Mag-upload ng mga larawan, kumuha ng agarang AI analysis, at protektahan ang iyong mga pananim na may 95% accuracy.',
    startDetection: 'Simulan ang Detection',
    watchDemo: 'Panoorin ang Demo',
    imagesAnalyzed: 'Mga Larawang Nasuri',
    detectionAccuracy: 'Accuracy ng Detection',
    diseasesIdentified: 'Mga Sakit na Natukoy',

    // Features Section
    whyChoose: 'Bakit Piliin ang Cucumber',
    ai: 'AI',
    cuttingEdge: 'Makabagong teknolohiya para sa modernong agrikultura',

    // Feature Cards
    feature1Title: 'Advanced AI Models',
    feature1Desc: 'Mga state-of-the-art deep learning algorithms na may 95%+ accuracy',
    feature2Title: 'Real-time Analysis',
    feature2Desc: 'Kumuha ng agarang resulta at actionable insights sa loob ng ilang segundo',
    feature3Title: 'Multi-Disease Detection',
    feature3Desc: 'Tukuyin ang 10+ karaniwang sakit ng pipino nang may precision',
    feature4Title: 'Mga Prevention Tips',
    feature4Desc: 'Kumuha ng expert recommendations para sa pag-iwas sa sakit',

    // CTA Section
    ctaTitle: 'Handa nang Protektahan ang Iyong mga Pananim?',
    ctaDescription: 'Sumali sa daan-daang magsasaka at agricultural experts na gumagamit ng CucumberAI para sa pag-iwas sa sakit.',
    ctaButton: 'Simulan ang Libreng Analysis',

    // Footer
    product: 'Produkto',
    pricing: 'Presyo',
    api: 'API',
    resources: 'Mga Resources',
    documentation: 'Dokumentasyon',
    blog: 'Blog',
    company: 'Kumpanya',
    contact: 'Kontak',
    careers: 'Karerahan',
    stayUpdated: 'Manatiling updated',
    subscribeText: 'Mag-subscribe para sa product updates at research news.',
    emailPlaceholder: 'Iyong email',
    subscribe: 'Mag-subscribe',
    allRightsReserved: 'Lahat ng karapatan ay nakalaan.',
    privacy: 'Privacy',
    terms: 'Terms',

    // Modal Titles
    modalFeatures: 'Mga Tampok',
    modalHowItWorks: 'Paano Ito Gumagana',
    modalResearch: 'Pananaliksik at Pagpapaunlad',
    modalDemo: 'Panoorin ang Demo',
    modalPricing: 'Mga Presyo',
    modalAPI: 'API Documentation',
    modalDocumentation: 'Dokumentasyon',
    modalBlog: 'Blog at Updates',
    modalAbout: 'Tungkol sa Amin',
    modalContact: 'Kontakin Kami',
    modalCareers: 'Karerahan',

    // Modal Content
    modalFeaturesSubtitle: 'Lahat ng kailangan mo para sa epektibong pamamahala ng sakit sa pipino',
    modalHowItWorksSubtitle: 'Simpleng hakbang para protektahan ang iyong mga pananim',
    modalResearchSubtitle: 'Sinusuportahan ng siyentipikong pananaliksik at patuloy na pagbabago',
    modalDemoSubtitle: 'Tingnan kung paano gumagana ang CucumberAI',

    // Modal Features
    modalFeature1Title: 'AI-Powered Detection',
    modalFeature1Desc: '95%+ accuracy gamit ang deep learning models',
    modalFeature2Title: 'Real-time Analysis',
    modalFeature2Desc: 'Resulta sa loob ng 2 segundo',
    modalFeature3Title: 'Multi-Disease Detection',
    modalFeature3Desc: 'Tukuyin ang 10+ sakit ng pipino',
    modalFeature4Title: 'Detailed Reports',
    modalFeature4Desc: 'PDF reports na may treatment plans',
    modalFeature5Title: 'Mobile App',
    modalFeature5Desc: 'Suporta sa iOS at Android',
    modalFeature6Title: 'Batch Processing',
    modalFeature6Desc: 'Mag-upload ng maraming larawan nang sabay-sabay',

    // How It Works Steps
    step1Title: 'Mag-upload ng Larawan',
    step1Desc: 'Kumuha o mag-upload ng malinaw na larawan ng dahon ng pipino',
    step2Title: 'AI Analysis',
    step2Desc: 'Sinusuri ng aming deep learning model ang larawan sa loob ng ilang segundo',
    step3Title: 'Kumuha ng Diagnosis',
    step3Desc: 'Tumanggap ng detalyadong identification ng sakit at severity',
    step4Title: 'Treatment Plan',
    step4Desc: 'Kumuha ng expert recommendations para sa treatment at prevention',

    // Research Modal
    researchAccuracy: 'Accuracy ng Detection',
    researchImages: 'Training Images',
    researchDiseases: 'Mga Sakit na Natukoy',
    researchPoint1: 'Nailathala sa Agricultural AI Journals',
    researchPoint2: 'Kolaborasyon sa Agricultural Universities',
    researchPoint3: 'Patuloy na Pagpapabuti ng Modelo',

    // Demo Modal
    demoVideoPlaceholder: 'Magpe-play ang demo video dito',
    demoOverview: 'Pangkalahatang-ideya ng Demo',
    demoStep1: 'Mag-upload ng larawan ng dahon ng pipino',
    demoStep2: 'AI analysis sa real-time',
    demoStep3: 'Kumuha ng detailed diagnosis report',
    demoStep4: 'Tingnan ang treatment recommendations',

    // Default Modal
    comingSoon: 'Ang content para sa {modal} ay darating pa lamang!',

    // Modal Footer
    getStarted: 'Magsimula',
    close: 'Isara',

    // Footer Tagline
    tagline: 'Intelligent na solusyon sa agrikultura para sa mas malulusog na pananim',
  }
}

// Create language store
const languageState = ref({
  current: 'en'
})

export function useLanguage() {
  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      languageState.value.current = langCode
      localStorage.setItem('preferredLanguage', langCode)
      document.documentElement.lang = langCode
      document.documentElement.dir = languages[langCode].dir
    }
  }

  const t = (key, params = {}) => {
    const currentLang = languageState.value.current
    let translation = translations[currentLang]?.[key] || translations.en[key] || key

    // Replace parameters in the translation
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param])
      })
    }

    return translation
  }

  // Load saved language preference
  const savedLang = localStorage.getItem('preferredLanguage')
  if (savedLang && translations[savedLang]) {
    languageState.value.current = savedLang
  }

  return {
    currentLanguage: computed(() => languageState.value.current),
    languages,
    setLanguage,
    t
  }
}