import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,  // ← ADD THIS
  addDoc,      // ← ADD THIS
  getDocs,     // ← ADD THIS
  query,       // ← ADD THIS
  where,       // ← ADD THIS
  orderBy,     // ← ADD THIS
  serverTimestamp // ← ADD THIS
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,  // ← ADD THIS (renamed to avoid conflict)
  uploadBytes,        // ← ADD THIS
  getDownloadURL      // ← ADD THIS
} from 'firebase/storage'  // ← ADD THIS

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfUGEau7B1Y0gWPWGqoVGtJL-pwm8e6_c",
  authDomain: "cucumber-58a42.firebaseapp.com",
  projectId: "cucumber-58a42",
  storageBucket: "cucumber-58a42.appspot.com",
  messagingSenderId: "730218615710",
  appId: "1:730218615710:web:5e5da216d066a0f2d6bc8f",
  measurementId: "G-XP6XBGM95W"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

console.debug('Firebase initialized with project:', app.options.projectId)

// Initialize services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)  // ← ADD THIS

// Export services
export {
  auth,
  db,
  storage,  // ← ADD THIS
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  storageRef,  // ← ADD THIS (renamed)
  uploadBytes, // ← ADD THIS
  getDownloadURL, // ← ADD THIS
  doc,
  setDoc,
  getDoc,
  collection,  // ← ADD THIS
  addDoc,      // ← ADD THIS
  getDocs,     // ← ADD THIS
  query,       // ← ADD THIS
  where,       // ← ADD THIS
  orderBy,     // ← ADD THIS
  serverTimestamp // ← ADD THIS
}