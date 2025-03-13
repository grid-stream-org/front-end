// src/__mocks__/firebase.ts
export const initializeApp = jest.fn()
export const getAuth = jest.fn(() => ({
  // Mock auth methods as needed
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  // Add other auth methods you use
}))
// Add other Firebase services you use
