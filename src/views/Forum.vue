<template>
  <section class="forum-page">
    <div class="forum-header">
      <div class="forum-header-content">
        <div>
          <p class="eyebrow">{{ t('discussionBoard') }}</p>
          <h1>{{ t('growerCommunityTitle') }}</h1>
          <p class="forum-description">
            {{ t('forumDescription') }}
          </p>
        </div>
        <div class="forum-metrics">
          <div class="metric-card">
            <span class="metric-value">{{ posts.length }}</span>
            <span class="metric-label">{{ t('recentPosts') }}</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">+24%</span>
            <span class="metric-label">{{ t('weeklyEngagement') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="forum-grid">
      <div class="forum-main">
        <div class="forum-compose card">
          <div class="compose-header">
            <div>
              <p class="eyebrow">{{ t('newDiscussion') }}</p>
              <h2>{{ t('createPost') }}</h2>
            </div>
            <span class="compose-note">{{ t('concisePost') }}</span>
          </div>

          <input
            v-model="newPostTitle"
            type="text"
            class="title-input"
            :placeholder="t('discussionTitle')"
          />

          <textarea
            v-model="newPostText"
            rows="5"
            :placeholder="t('shareWithCommunity')"
          ></textarea>

          <div v-if="previewImage" class="image-preview">
            <img :src="previewImage" alt="Selected preview" />
          </div>

          <div class="compose-actions">
            <label class="upload-btn">
              <input type="file" accept="image/*" @change="handleImageSelect" />
              {{ t('addPhoto') }}
            </label>
            <button class="post-btn" @click="submitPost" :disabled="isPosting">
              {{ isPosting ? t('posting') : t('postDiscussion') }}
            </button>
          </div>
          <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
        </div>

        <div class="forum-feed">
          <div v-if="isLoading" class="card empty-state">{{ t('loadingDiscussions') }}</div>
          <div v-else-if="posts.length === 0" class="card empty-state">
            {{ t('noDiscussions') }}
          </div>

          <div v-else v-for="post in posts" :key="post.id" class="card post-card">
            <div class="post-top">
              <span class="post-topic">{{ t('community') }}</span>
              <span class="post-time">{{ formatDate(post.createdAt) }}</span>
            </div>

            <h3 class="post-title">{{ getPostTitle(post) }}</h3>

            <div class="post-meta-row">
              <div class="post-author">
                <div class="author-avatar">{{ getAuthorInitials(post.authorName) }}</div>
                <div>
                  <strong>{{ post.authorName || t('communityMember') }}</strong>
                  <p>{{ t('postedGrowerForum') }}</p>
                </div>
              </div>
                      <div class="post-actions">
                <button class="action-btn" @click="toggleReply(post.id)">
                  {{ activeReplyId === post.id ? t('cancel') : t('reply') }}
                </button>
                <button class="action-btn secondary">{{ t('share') }}</button>
                <button
                  v-if="post.replies?.length"
                  class="action-btn secondary"
                  @click="toggleReplies(post.id)"
                >
                  {{ showRepliesByPost[post.id] ? t('hideReplies') : t('showReplies', { count: post.replies.length }) }}
                </button>
              </div>
            </div>

            <p class="post-text">{{ post.text }}</p>

            <div v-if="showRepliesByPost[post.id] && post.replies?.length" class="replies-section">
              <div v-for="(reply, index) in post.replies" :key="index" class="reply-card">
                <div class="reply-header">
                  <strong>{{ reply.authorName || 'Community Member' }}</strong>
                  <span>{{ formatDate(reply.createdAt) }}</span>
                </div>
                <p class="reply-text">{{ reply.text }}</p>
              </div>
            </div>

            <div v-if="activeReplyId === post.id" class="reply-form">
              <textarea
                v-model="replyText"
                rows="3"
                :placeholder="t('writeReply')"
              ></textarea>
              <div class="reply-controls">
                <button class="post-btn" @click="submitReply(post.id)" :disabled="isPosting">
                  {{ isPosting ? t('postingReply') : t('submitReply') }}
                </button>
                <p class="reply-status" v-if="replyStatus">{{ replyStatus }}</p>
              </div>
            </div>

            <img v-if="post.imageUrl" :src="post.imageUrl" alt="Forum post" class="post-image" />
          </div>
        </div>
      </div>

      <aside class="forum-sidebar">
        <div class="sidebar-card">
          <h3>{{ t('communityGuidelines') }}</h3>
          <ul>
            <li>{{ t('respectfulPosts') }}</li>
            <li>{{ t('clearContext') }}</li>
            <li>{{ t('actionableAdvice') }}</li>
          </ul>
        </div>

        <div class="sidebar-card">
          <h3>{{ t('popularTopics') }}</h3>
          <div class="tag-list">
            <span>{{ t('plantHealth') }}</span>
            <span>{{ t('pestControl') }}</span>
            <span>{{ t('harvestTips') }}</span>
            <span>{{ t('modelAccuracy') }}</span>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
import { useLanguage } from '../store/language'
import {
  auth,
  db,
  storage,
  storageRef,
  uploadBytes,
  getDownloadURL,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  doc
} from '../firebase'

const authStore = useAuthStore()
const { t } = useLanguage()
const newPostText = ref('')
const newPostTitle = ref('')
const selectedImage = ref(null)
const previewImage = ref('')
const posts = ref([])
const activeReplyId = ref(null)
const showRepliesByPost = ref({})
const replyText = ref('')
const replyStatus = ref('')
const isPosting = ref(false)
const isLoading = ref(true)
const statusMessage = ref('')

const handleImageSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  selectedImage.value = file
  previewImage.value = URL.createObjectURL(file)
}

const submitPost = async () => {
  if (!newPostText.value.trim() && !selectedImage.value) {
    statusMessage.value = t('writeOrAddPhoto')
    return
  }

  isPosting.value = true
  statusMessage.value = ''

  try {
    await authStore.initializeAuth()

    const user = auth.currentUser || authStore.user
    if (!user) {
      statusMessage.value = t('signInToPost')
      return
    }

    let imageUrl = ''

    if (selectedImage.value) {
      const safeFileName = selectedImage.value.name.replace(/\s+/g, '_')
      const fileRef = storageRef(storage, `forum/${Date.now()}_${safeFileName}`)
      await uploadBytes(fileRef, selectedImage.value)
      imageUrl = await getDownloadURL(fileRef)
    }

    await addDoc(collection(db, 'forumPosts'), {
      title: newPostTitle.value.trim() || '',
      text: newPostText.value.trim(),
      imageUrl,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || 'Community Member',
      createdAt: serverTimestamp()
    })

    newPostTitle.value = ''
    newPostText.value = ''
    selectedImage.value = null
    previewImage.value = ''
    statusMessage.value = t('postPublished')
    await loadPosts()
  } catch (error) {
    console.error('Failed to publish forum post:', error)
    statusMessage.value = t('postFailed')
  } finally {
    isPosting.value = false
  }
}

const loadPosts = async () => {
  try {
    const postsRef = collection(db, 'forumPosts')
    const q = query(postsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Failed to load forum posts:', error)
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

const toggleReply = (postId) => {
  if (activeReplyId.value === postId) {
    activeReplyId.value = null
    replyText.value = ''
    replyStatus.value = ''
    return
  }

  activeReplyId.value = postId
  replyText.value = ''
  replyStatus.value = ''
}

const toggleReplies = (postId) => {
  showRepliesByPost.value = {
    ...showRepliesByPost.value,
    [postId]: !showRepliesByPost.value[postId]
  }
}

const submitReply = async (postId) => {
  if (!replyText.value.trim()) {
    replyStatus.value = t('enterReply')
    return
  }

  isPosting.value = true
  replyStatus.value = ''

  try {
    await authStore.initializeAuth()
    const user = auth.currentUser || authStore.user
    if (!user) {
      replyStatus.value = t('signInToReply')
      return
    }

    const postRef = doc(db, 'forumPosts', postId)
    const replyPayload = {
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || 'Community Member',
      text: replyText.value.trim(),
      createdAt: new Date()
    }

    await updateDoc(postRef, {
      replies: arrayUnion(replyPayload)
    })

    replyText.value = ''
    activeReplyId.value = null
    replyStatus.value = t('replyPublished')
    await loadPosts()
  } catch (error) {
    console.error('Failed to post reply:', error)
    replyStatus.value = t('replyFailed')
  } finally {
    isPosting.value = false
  }
}

const getPostTitle = (post) => {
  if (post.title && post.title.trim()) {
    return post.title
  }

  const text = post.text || ''
  if (text.length <= 72) {
    return text || t('untitledDiscussion')
  }
  return `${text.slice(0, 72).trim()}…`
}

const getAuthorInitials = (name) => {
  if (!name) return 'CM'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const formatDate = (value) => {
  if (!value) return t('justNow')
  const date = value?.toDate ? value.toDate() : new Date(value)
  return date.toLocaleString(t('locale') || 'en-US')
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.forum-page {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 12px 0;
}

.forum-header-content {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
}

.eyebrow {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #10b981;
  font-weight: 700;
  font-size: 0.78rem;
  margin-bottom: 12px;
}

.forum-header h1 {
  font-size: clamp(2rem, 2.4vw, 2.8rem);
  margin: 0;
  max-width: 640px;
}

.forum-description {
  color: #475569;
  line-height: 1.8;
  margin-top: 12px;
  max-width: 720px;
}

.forum-metrics {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.metric-card {
  min-width: 130px;
  padding: 16px 18px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
}

.metric-label {
  color: #64748b;
  font-size: 0.92rem;
}

.forum-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 24px;
}

.forum-main,
.forum-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 16px 35px rgba(15, 23, 42, 0.06);
}

.compose-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.compose-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.compose-note {
  color: #475569;
  font-size: 0.95rem;
  white-space: nowrap;
}

.title-input,
.forum-compose textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 16px;
  font-size: 1rem;
  color: #0f172a;
  background: #f8fafc;
}

.title-input {
  margin-bottom: 16px;
}

.title-input:focus,
.forum-compose textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
  background: white;
}

.forum-compose textarea {
  resize: vertical;
  min-height: 156px;
}

.compose-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.upload-btn,
.post-btn,
.action-btn {
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.upload-btn {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 12px 18px;
}

.upload-btn input {
  display: none;
}

.post-btn {
  background: #10b981;
  color: white;
  padding: 12px 24px;
}

.post-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.post-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.image-preview img,
.post-image {
  width: 100%;
  max-height: 340px;
  object-fit: cover;
  border-radius: 16px;
  margin-top: 18px;
}

.post-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.post-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

.post-topic {
  background: rgba(16, 185, 129, 0.14);
  color: #065f46;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.post-time {
  color: #64748b;
  font-size: 0.9rem;
}

.post-title {
  margin: 0;
  font-size: 1.2rem;
  color: #0f172a;
}

.post-meta-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #10b981;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
}

.post-author strong {
  display: block;
  font-size: 0.95rem;
}

.post-author p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.post-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 0 0;
  border-top: 1px solid #e2e8f0;
}

.reply-form textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 14px;
  resize: vertical;
  min-height: 110px;
  background: #f8fafc;
}

.replies-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 0 0;
  border-top: 1px solid #e2e8f0;
}

.reply-card {
  background: #f8fafc;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #e2e8f0;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  color: #475569;
}

.reply-text {
  margin: 0;
  line-height: 1.75;
  color: #334155;
}

.reply-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.reply-status {
  color: #0f766e;
  font-size: 0.95rem;
}

.action-btn {
  padding: 10px 18px;
  background: #f8fafc;
  color: #0f172a;
}

.action-btn.secondary {
  background: white;
  border: 1px solid #cbd5e1;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.post-text {
  white-space: pre-wrap;
  line-height: 1.75;
  color: #334155;
}

.empty-state {
  text-align: center;
  color: #64748b;
  padding: 40px 0;
}

.status-message {
  margin-top: 10px;
  color: #0f766e;
}

.forum-sidebar {
  gap: 20px;
}

.sidebar-card h3 {
  margin-top: 0;
  font-size: 1.05rem;
}

.sidebar-card ul {
  margin: 16px 0 0;
  padding-left: 18px;
  color: #475569;
  line-height: 1.8;
}

.sidebar-card ul li {
  margin-bottom: 10px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.tag-list span {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.9rem;
}

@media (max-width: 992px) {
  .forum-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .forum-page {
    padding: 16px 14px 24px;
    gap: 20px;
  }

  .forum-header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .forum-metrics {
    width: 100%;
    gap: 12px;
    justify-content: flex-start;
  }

  .metric-card {
    width: 100%;
    min-width: auto;
  }

  .card {
    padding: 18px;
  }

  .compose-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .compose-note {
    white-space: normal;
  }

  .compose-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .upload-btn,
  .post-btn,
  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .post-top,
  .post-meta-row,
  .post-author,
  .reply-header,
  .reply-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-title {
    font-size: 1.1rem;
  }

  .post-actions {
    width: 100%;
  }

  .post-actions .action-btn {
    width: 100%;
  }

  .reply-form textarea {
    min-height: 100px;
  }

  .image-preview img,
  .post-image {
    max-height: 260px;
  }

  .forum-sidebar {
    gap: 18px;
  }

  .sidebar-card {
    padding: 18px;
  }
}

@media (max-width: 560px) {
  .forum-header h1 {
    font-size: 1.8rem;
  }

  .eyebrow {
    font-size: 0.72rem;
  }

  .forum-description {
    font-size: 0.95rem;
  }

  .author-avatar {
    width: 38px;
    height: 38px;
  }

  .post-title {
    font-size: 1rem;
  }

  .post-actions {
    gap: 8px;
  }
}
</style>
