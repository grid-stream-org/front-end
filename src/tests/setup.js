// src/tests/setup.js
// Mock Vite's import.meta.env
if (typeof global.process === 'undefined') {
  global.process = {}
}
if (typeof global.process.env === 'undefined') {
  global.process.env = {}
}

// Add your environment variables here
process.env.VITE_FIREBASE_API_KEY = 'test-api-key'
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test-auth-domain'
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-id'
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket'
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id'
process.env.VITE_FIREBASE_APP_ID = 'test-app-id'

// Mock import.meta
global.import = {
  meta: {
    env: process.env,
  },
}
