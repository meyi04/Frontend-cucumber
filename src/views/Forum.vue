<template>
  <section class="forum-page">
    <div class="forum-header">
      <h1>Community Forum</h1>
      <p>Share updates, ask questions, and help other growers with photos and tips.</p>
    </div>

    <div class="forum-compose card">
      <h2>Create a post</h2>
      <textarea v-model="newPostText" rows="4" placeholder="What would you like to share with the community?"></textarea>

      <div v-if="previewImage" class="image-preview">
        <img :src="previewImage" alt="Selected preview" />
      </div>

      <div class="compose-actions">
        <label class="upload-btn">
          <input type="file" accept="image/*" @change="handleImageSelect" />
          Add photo
        </label>
        <button class="post-btn" @click="submitPost" :disabled="isPosting">
          {{ isPosting ? 'Posting...' : 'Post' }}
        </button>
      </div>
      <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
    </div>

    <div class="forum-feed">
      <div v-if="isLoading" class="card empty-state">Loading posts...</div>
      <div v-else-if="posts.length === 0" class="card empty-state">
        No posts yet. Be the first to share something helpful.
      </div>
      <div v-else v-for="post in posts" :key="post.id" class="card post-card">
        <div class="post-meta">
          <div>
            <strong>{{ post.authorName || 'Community Member' }}</strong>
            <p>{{ formatDate(post.createdAt) }}</p>
          </div>
        </div>
        <p class="post-text">{{ post.text }}</p>
        <img v-if="post.imageUrl" :src="post.imageUrl" alt="Forum post" class="post-image" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'
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
  serverTimestamp                                                                                                                                                                           
} from '../firebase'

const authStore = useAuthStore()
const newPostText = ref('')
const selectedImage = ref(null)
const previewImage = ref('')
const posts = ref([])
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
    statusMessage.value = 'Please write something or add a photo.'
    return
  }

  isPosting.value = true
  statusMessage.value = ''

  try {
    await authStore.initializeAuth()

    const user = auth.currentUser || authStore.user
    if (!user) {
      statusMessage.value = 'Please sign in before posting to the forum.'
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
      text: newPostText.value.trim(),
      imageUrl,
      authorId: user.uid,
      authorName: user.displayName || user.email?.split('@')[0] || 'Community Member',
      createdAt: serverTimestamp()
    })

    newPostText.value = ''
    selectedImage.value = null
    previewImage.value = ''
    statusMessage.value = 'Post published successfully.'
    await loadPosts()
  } catch (error) {
    console.error('Failed to publish forum post:', error)
    statusMessage.value = 'Unable to post right now. Please try again.'
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

const formatDate = (value) => {
  if (!value) return 'Just now'
  const date = value?.toDate ? value.toDate() : new Date(value)
  return date.toLocaleString()
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.forum-page {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forum-header h1 {
  font-size: 2rem;
  margin-bottom: 6px;
}

.forum-header p {
  color: #475569;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
}

.forum-compose textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px;
  resize: vertical;
  margin-top: 10px;
}

.compose-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
}

.upload-btn, .post-btn {
  border: none;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

.upload-btn {
  background: #e0f2fe;
  color: #0369a1;
}

.upload-btn input {
  display: none;
}

.post-btn {
  background: #10b981;
  color: white;
}

.post-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.image-preview img,
.post-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 12px;
}

.post-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-meta p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.post-text {
  white-space: pre-wrap;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  color: #64748b;
}

.status-message {
  margin-top: 10px;
  color: #0f766e;
}
</style>
