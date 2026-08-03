<template>
  <!-- Floating Chat Button -->
  <button 
    class="chatbot-btn"
    :class="{ 'active': isOpen, 'pulsing': hasUnreadMessages }"
    @click="toggleChat"
    :title="isOpen ? 'Close chat' : 'Open Plant Assistant'"
  >
    <div class="btn-content">
      <svg v-if="!isOpen" viewBox="0 0 24 24" fill="none">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span v-if="hasUnreadMessages" class="notification-dot"></span>
    </div>
  </button>

  <!-- Chat Window -->
  <div v-if="isOpen" class="chat-window" :class="{ 'loading': isLoading }">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="header-left">
        <div class="chatbot-avatar">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#10b981"/>
            <path d="M7 12L10 15L17 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="header-info">
          <h3>Dr. Green 🌿</h3>
          <p>Plant Disease Expert</p>
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">Online</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="header-btn" @click="clearChat" title="Clear conversation">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="header-btn close-btn" @click="toggleChat" title="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
      <div class="chat-messages" ref="messagesContainer">
        <!-- Conversation Messages -->
        <div v-for="message in messages" :key="message.id" :class="['message', message.sender]">
          <div class="message-content">
            <template v-if="message.sender === 'user'">
              <p>{{ message.text }}</p>
            </template>
            <template v-else-if="message.sender === 'bot'">
              <div v-if="message.loading" class="loading-message">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p class="thinking">Dr. Green is thinking...</p>
              </div>
              <div v-else class="bot-response" v-html="formatResponse(message.text)"></div>
            </template>
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>

      <!-- Compact examples toggle (below messages) -->
      <div class="quick-examples">
        <button class="toggle-examples" @click="showExamples = !showExamples">
          {{ showExamples ? 'Hide examples' : 'Quick examples' }}
        </button>
        <div v-if="showExamples" class="example-questions compact">
          <button v-for="q in exampleQuestions.slice(0,4)" :key="q" @click="askExample(q)">
            {{ q }}
          </button>
        </div>
      </div>

    <!-- Chat Input -->
    <div class="chat-input">
      <div class="input-wrapper">
        <textarea 
          v-model="userInput"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact.prevent="userInput += '\n'"
          placeholder="Describe your plant symptoms or ask a question..."
          rows="1"
          ref="textInput"
          @input="resizeTextarea"
          :disabled="isLoading"
        ></textarea>
        <div class="input-actions">
          <button 
            class="send-btn" 
            @click="sendMessage"
            :disabled="!userInput.trim() || isLoading"
            :title="isLoading ? 'Please wait...' : 'Send message'"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="input-hint">
        <small>Press Enter to send, Shift+Enter for new line</small>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="error = ''">Dismiss</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { marked } from 'marked' // For markdown rendering

// Initialize marked for markdown parsing
marked.setOptions({
  breaks: true,
  gfm: true
})

const isOpen = ref(false)
const userInput = ref('')
const messages = ref([])
const isLoading = ref(false)
const error = ref('')
const hasUnreadMessages = ref(false)
const messagesContainer = ref(null)
const textInput = ref(null)

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Example questions
const exampleQuestions = [
  "How to treat powdery mildew on cucumber plants?",
  "Why are my plant leaves turning yellow with brown spots?",
  "What causes sudden wilting in plants?",
  "How to prevent fungal diseases in humid weather?",
  "Best organic treatment for aphids on roses?",
  "What's wrong with my plant? Leaves have white fuzzy patches.",
  "How often should I water plants to avoid root rot?"
]

// UI state for compact examples
const showExamples = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasUnreadMessages.value = false
    nextTick(() => {
      scrollToBottom()
      textInput.value?.focus()
    })
  }
}

const askExample = (question) => {
  userInput.value = question
  sendMessage()
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return

  // Add user message
  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: text,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  const userQuery = text
  userInput.value = ''
  resizeTextarea()
  
  // Add loading message
  const loadingMessage = {
    id: Date.now() + 1,
    sender: 'bot',
    text: '',
    loading: true,
    timestamp: new Date()
  }
  messages.value.push(loadingMessage)
  
  isLoading.value = true
  error.value = ''
  scrollToBottom()
  
  try {
    // Prepare conversation history
    const history = messages.value
      .filter(m => !m.loading)
      .map(m => ({
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }))
    
    // Call ChatGPT API
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userQuery,
        history: history
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response')
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error')
    }
    
    // Remove loading message and add bot response
    messages.value = messages.value.filter(m => !m.loading)
    
    const botMessage = {
      id: Date.now() + 2,
      sender: 'bot',
      text: data.response,
      timestamp: new Date()
    }
    
    messages.value.push(botMessage)
    
    // Save to localStorage
    saveConversation()
    
  } catch (err) {
    console.error('Chat error:', err)
    
    // Remove loading message
    messages.value = messages.value.filter(m => !m.loading)
    
    // Show error message
    error.value = `Sorry, I encountered an error: ${err.message}. Please try again.`
    
    // Add fallback response
    const fallbackMessage = {
      id: Date.now() + 3,
      sender: 'bot',
      text: getFallbackResponse(userQuery),
      timestamp: new Date()
    }
    
    messages.value.push(fallbackMessage)
    
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const getFallbackResponse = (query) => {
  // Simple fallback responses when API fails
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('powdery') || lowerQuery.includes('mildew')) {
    return `**Powdery Mildew Treatment:**\n\n1. **Immediate Action:** Remove infected leaves carefully\n2. **Organic Spray:** Mix 1 tbsp baking soda + ½ tsp liquid soap + 1 gallon water\n3. **Apply:** Spray every 7-10 days, early morning\n4. **Prevention:** Improve air circulation, avoid overhead watering\n\n⚠️ **Severe Cases:** Use sulfur-based fungicide following label instructions`
  }
  
  if (lowerQuery.includes('yellow') && lowerQuery.includes('spot')) {
    return `**Yellow Leaves with Brown Spots:**\n\n🔍 **Possible Causes:**\n1. Fungal leaf spot disease\n2. Bacterial infection\n3. Nutrient deficiency (especially magnesium)\n4. Pest damage\n\n💊 **Treatment:**\n• Remove affected leaves\n• Apply copper fungicide\n• Check soil pH and nutrients\n• Ensure proper watering\n\n📞 **If spreading rapidly:** Consult local agricultural extension`
  }
  
  return `I understand you're asking about plant health. While I'm experiencing technical difficulties, here's general advice:\n\n1. **Isolate** affected plants immediately\n2. **Take clear photos** of symptoms\n3. **Check** soil moisture and drainage\n4. **Consult** local nursery or agricultural expert\n5. **Consider** common issues: overwatering, pests, or fungal diseases\n\nPlease try again in a moment for more specific advice!`
}

const formatResponse = (text) => {
  // Convert markdown to HTML and add styling
  const html = marked(text)
  // Add additional styling for plant-specific content
  return html.replace(
    /(🌿|💊|🛡️|⚠️|📋|🔍|✅|❌)/g,
    '<span class="response-icon">$1</span>'
  )
}

const clearChat = () => {
  if (confirm('Clear conversation history?')) {
    messages.value = []
    localStorage.removeItem('plant_chat_history')
  }
}

const saveConversation = () => {
  try {
    const conversation = messages.value.filter(m => !m.loading)
    localStorage.setItem('plant_chat_history', JSON.stringify(conversation))
  } catch (e) {
    console.error('Failed to save conversation:', e)
  }
}

const loadConversation = () => {
  try {
    const saved = localStorage.getItem('plant_chat_history')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Convert timestamp strings back to Date objects
      messages.value = parsed.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }
  } catch (e) {
    console.error('Failed to load conversation:', e)
  }
}

const resizeTextarea = () => {
  nextTick(() => {
    const textarea = textInput.value
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px'
    }
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Load conversation on mount
onMounted(() => {
  loadConversation()
})

// Watch for new messages
watch(messages, () => {
  scrollToBottom()
  if (!isOpen.value && messages.value.length > 0) {
    hasUnreadMessages.value = true
  }
}, { deep: true })
</script>

<style scoped>
/* Chat Button */
.chatbot-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #23ff52, #34d399);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 25px rgba(16, 185, 129, 0.4);
  z-index: 9999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(181, 182, 182, 0.6);
}

.chatbot-btn.active {
  background: linear-gradient(135deg, #ef4444, #f87171);
  transform: rotate(90deg);
}

.chatbot-btn.pulsing {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.btn-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chatbot-btn svg {
  width: 28px;
  height: 28px;
  color: white;
}

.notification-dot {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background: #ef4444;
  border: 2px solid white;
  border-radius: 50%;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Chat Window */
.chat-window {
  position: fixed;
  bottom: 85px;
  right: 24px;
  width: 400px;
  height: 450px;
  background: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  z-index: 9998;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Chat Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.chatbot-avatar {
  width: 48px;
  height: 48px;
  background: rgb(255, 255, 255);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chatbot-avatar svg {
  width: 28px;
  height: 28px;
}

.header-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.header-info p {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 4px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #24f16f;
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.75rem;
  color: #22c55e;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.header-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.header-btn svg {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.close-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
}

.close-btn:hover svg {
  color: #ef4444;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #fafafa;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
  animation: messageAppear 0.3s ease;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
}

.message.bot {
  align-self: flex-start;
}

.message-content {
  padding: 16px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.user .message-content {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-content {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.welcome-message .message-content {
  background: white;
  border: 2px solid #dbeafe;
}

.welcome-content h4 {
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 1.125rem;
}

.welcome-content p {
  color: #475569;
  margin-bottom: 12px;
  line-height: 1.5;
}

.welcome-content ul {
  margin: 12px 0;
  padding-left: 20px;
  color: #475569;
}

.welcome-content li {
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.examples {
  margin-top: 16px !important;
}

.example-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.example-questions button {
  text-align: left;
  padding: 10px 16px;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 10px;
  color: #065f46;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.example-questions button:hover {
  background: #dcfce7;
  transform: translateX(4px);
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.thinking {
  color: #64748b;
  font-size: 0.875rem;
  font-style: italic;
}

.bot-response {
  line-height: 1.6;
}

.bot-response :deep(p) {
  margin-bottom: 12px;
}

.bot-response :deep(ul),
.bot-response :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.bot-response :deep(li) {
  margin-bottom: 8px;
}

.bot-response :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.bot-response :deep(.response-icon) {
  font-size: 1.2em;
  margin-right: 6px;
}

.message-time {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 6px;
  align-self: flex-end;
}

.message.bot .message-time {
  align-self: flex-start;
}

/* Chat Input */
.chat-input {
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.875rem;
  resize: none;
  max-height: 80px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  line-height: 1.4;
}

.chat-input textarea:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.chat-input textarea:disabled {
  background: #f8fafc;
  cursor: not-allowed;
}

.send-btn {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.send-btn svg {
  width: 20px;
  height: 20px;
  color: white;
}

.input-hint {
  text-align: center;
  margin-top: 8px;
}

.input-hint small {
  color: #94a3b8;
  font-size: 0.75rem;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  border-top: 1px solid #fee2e2;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message p {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}

.error-message button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 640px) {
  .chat-window {
    width: calc(100vw - 48px);
    height: 70vh;
    right: 24px;
    left: 24px;
    bottom: 84px;
  }
  
  .chatbot-btn {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
}

/* Quick examples compact styles */
.quick-examples {
  padding: 0 16px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: transparent;
}
.toggle-examples {
  align-self: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #334155;
}
.example-questions.compact {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.example-questions.compact button {
  white-space: nowrap;
  padding: 8px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  color: #0f172a;
  font-size: 0.85rem;
}
.example-questions.compact button:hover {
  transform: translateY(-2px);
}
</style>