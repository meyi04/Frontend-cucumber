<template>
  <div class="stat-card" :class="color">
    <div class="card-content">
      <div class="card-icon">
        {{ icon }}
      </div>
      <div class="card-stats">
        <div class="stat-number" :class="{ 'loading': loading }">
          {{ loading ? '...' : number }}
        </div>
        <div class="stat-label">{{ label }}</div>
      </div>
      <div class="card-trend" :class="getTrendClass(trend)">
        {{ trend }}
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: loading ? '50%' : '100%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  number: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📊'
  },
  trend: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'gradient-blue'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const getTrendClass = (trend) => {
  if (trend.startsWith('+')) return 'trend-up'
  if (trend.startsWith('-')) return 'trend-down'
  return 'trend-neutral'
}
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.05),
    0 5px 10px rgba(0, 0, 0, 0.02),
    0 0 0 1px rgba(0, 0, 0, 0.01);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.01);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
}

.stat-card.gradient-blue {
  --gradient-start: #3b82f6;
  --gradient-end: #8b5cf6;
}

.stat-card.gradient-green {
  --gradient-start: #10b981;
  --gradient-end: #22c55e;
}

.stat-card.gradient-orange {
  --gradient-start: #f59e0b;
  --gradient-end: #ef4444;
}

.stat-card.gradient-purple {
  --gradient-start: #8b5cf6;
  --gradient-end: #ec4899;
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.card-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.card-stats {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
  line-height: 1;
}

.stat-number.loading {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  min-height: 2.5rem;
  width: 80%;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.4;
}

.card-trend {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  align-self: center;
}

.trend-up {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.trend-down {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.trend-neutral {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
}

.progress-bar {
  margin-top: 24px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
  border-radius: 2px;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>