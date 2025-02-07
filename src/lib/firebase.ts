import { initializeApp } from 'firebase/app'
import { FirebaseError } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const handleFirebaseError = (error: unknown): string => {
  if (!(error instanceof FirebaseError)) {
    return 'An unexpected error occurred. Please try again.'
  }

  switch (error.code) {
    // Common login/registration errors
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/missing-password':
      return 'Please provide a password'

    // Google login specific errors
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Login window was closed. Please try again.'
    case 'auth/popup-blocked':
      return 'Login popup was blocked by your browser. Please allow popups and try again.'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different login credentials.'

    // Network and technical errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    case 'auth/internal-error':
      return 'Authentication service encountered an error. Please try again.'

    default:
      return `Authentication error: ${error.message}`
  }
}
