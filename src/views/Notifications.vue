<template>
  <section class="notifications-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">{{ t('notifications') }}</p>
        <h1>{{ t('notifications') }}</h1>
        <p>{{ unreadCount ? t('notificationUpdates', { count: unreadCount }) : t('allCaughtUp') }}</p>
      </div>
      <button class="mark-all" type="button" :disabled="unreadCount === 0" @click="markAllAsRead">
        {{ t('markAllRead') }}
      </button>
    </div>

    <div v-if="notifications.length" class="notification-list">
      <article
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-card"
        :class="{ unread: !notification.read }"
        @click="openNotification(notification)"
      >
        <div class="notification-icon">i</div>
        <div class="notification-content">
          <strong>{{ notification.message }}</strong>
          <span>{{ notification.time }}</span>
        </div>
        <button
          v-if="!notification.read"
          class="read-button"
          type="button"
          :aria-label="t('markAllRead')"
          @click.stop="markAsRead(notification.id)"
        >✓</button>
      </article>
    </div>
    <div v-else class="empty-state">{{ t('noNewNotifications') }}</div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useLanguage } from '../store/language'
import { db } from '../firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLanguage()
const notifications = ref([])
const unreadCount = computed(() => notifications.value.filter(notification => !notification.read).length)
let unsubscribe = null

const readKey = () => `cucumber_read_notifications_${authStore.user?.uid || 'guest'}`
const readIds = () => new Set(JSON.parse(localStorage.getItem(readKey()) || '[]'))
const saveReadIds = ids => localStorage.setItem(readKey(), JSON.stringify([...ids]))

const formatTimestamp = value => {
  if (!value) return t('justNow')
  const date = value?.toDate ? value.toDate() : new Date(value)
  return date.toLocaleString(t('locale') || 'en-US')
}

const createNotification = post => {
  const text = (post.text || '').trim()
  const short = text.length > 120 ? `${text.slice(0, 120)}…` : text
  const id = `post_${post.id}`
  return {
    id,
    type: 'info',
    message: `${post.authorName || 'Someone'}: ${short || 'New post'}`,
    time: formatTimestamp(post.createdAt),
    read: readIds().has(id),
    meta: { postId: post.id }
  }
}

const markAsRead = id => {
  const notification = notifications.value.find(item => item.id === id)
  if (!notification) return
  notification.read = true
  const ids = readIds()
  ids.add(id)
  saveReadIds(ids)
}

const markAllAsRead = () => {
  const ids = readIds()
  notifications.value.forEach(notification => {
    notification.read = true
    ids.add(notification.id)
  })
  saveReadIds(ids)
}

const openNotification = notification => {
  markAsRead(notification.id)
  router.push(`/forum?post=${notification.meta.postId}`)
}

onMounted(async () => {
  await authStore.initializeAuth()
  const postsQuery = query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'))
  unsubscribe = onSnapshot(postsQuery, snapshot => {
    notifications.value = snapshot.docs
      .map(postDoc => ({ id: postDoc.id, ...postDoc.data() }))
      .filter(post => !post.authorId || post.authorId !== authStore.user?.uid)
      .map(createNotification)
  }, error => console.error('Notifications listener error:', error))
})

onUnmounted(() => unsubscribe?.())
</script>

<style scoped>
.notifications-page { max-width: 900px; margin: 0 auto; padding: 28px 0; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.eyebrow { margin: 0 0 8px; color: #0f9f70; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 0 0 8px; color: #073d31; }
.page-header p:last-child { margin: 0; color: #6b8377; }
.mark-all { padding: 10px 14px; border: 0; border-radius: 10px; color: #fff; background: #0f9f70; cursor: pointer; }
.mark-all:disabled { opacity: .5; cursor: not-allowed; }
.notification-list { display: grid; gap: 10px; }
.notification-card { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid #e1ece6; border-radius: 14px; background: #fff; cursor: pointer; }
.notification-card.unread { border-color: #9bd9bf; background: #f3fbf7; }
.notification-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: 0 0 36px; border-radius: 50%; color: #fff; background: #0f9f70; font-weight: 800; }
.notification-content { min-width: 0; flex: 1; display: grid; gap: 5px; }
.notification-content strong { color: #173c2f; overflow-wrap: anywhere; }
.notification-content span { color: #71877c; font-size: .8rem; }
.read-button { border: 0; color: #0f9f70; background: transparent; font-size: 1.1rem; cursor: pointer; }
.empty-state { padding: 48px 20px; border: 1px dashed #cbdcd3; border-radius: 14px; color: #71877c; text-align: center; }
@media (max-width: 600px) {
  .notifications-page { padding: 18px 0; }
  .page-header { flex-direction: column; }
  .mark-all { width: 100%; }
}
</style>
