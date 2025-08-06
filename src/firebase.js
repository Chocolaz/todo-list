// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// 🔁 ใส่ config ของคุณที่ได้จาก Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyB419uMq71YOo3bhG_vpKoT874swscBv8M',
  authDomain: 'todo-p-415e3.firebaseapp.com',
  projectId: 'todo-p-415e3',
  storageBucket: 'todo-p-415e3.firebasestorage.app',
  messagingSenderId: '1019398170201',
  appId: '1:1019398170201:web:521e27a0c8f061e703f348',
  measurementId: 'G-90ZNSQF9TJ'
}

// ✅ initialize firebase app
const app = initializeApp(firebaseConfig)

// ✅ export services you want to use
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, auth, provider }
