import { doc, setDoc, getDoc, getFirestore } from '@firebase/firestore'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

import { auth } from '@/lib/firebase'
import { AuthResponse, UserData, UserRole } from '@/types'

interface AuthContextType {
  user: UserData | null
  loading: boolean
  // eslint-disable-next-line no-unused-vars
  login: (email: string, password: string) => Promise<void>

  register: (
    // eslint-disable-next-line no-unused-vars
    email: string,
    // eslint-disable-next-line no-unused-vars
    password: string,
  ) => Promise<AuthResponse>
  loginWithGoogle: () => Promise<AuthResponse>
  logout: () => Promise<void>
  // eslint-disable-next-line no-unused-vars
  updateProfile: (data: Partial<UserData>) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  resetPassword: (email: string) => Promise<void>

  createUserDocument: (
    // eslint-disable-next-line no-unused-vars
    user: User,
    // eslint-disable-next-line no-unused-vars
    displayName: string,
    // eslint-disable-next-line no-unused-vars
    phoneNumber: string,
    // eslint-disable-next-line no-unused-vars
    projectId: string,
  ) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const db = getFirestore()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid))
    const exists = userDoc.exists()
    if (exists) {
      const data = userDoc.data()
      const userData: UserData = {
        uid: data.uid,
        projectId: data.projectId,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        photoURL: data.photoURL,
        role: data.role,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        credential: data.user,
      }
      setUser(userData)
    }
  }

  const createUserDocument = async (
    user: User,
    displayName: string,
    phoneNumber: string,
    projectId: string,
  ) => {
    const userDoc = {
      uid: user.uid,
      projectId,
      email: user.email!,
      displayName: displayName || user.displayName || '',
      phoneNumber: phoneNumber || user.phoneNumber || '',
      photoURL: user.photoURL,
      role: UserRole.RESIDENTIAL,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), userDoc)
    setUser({ ...userDoc, credential: user })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        setUser(null)
        setLoading(false)
        return
      }
      auth.updateCurrentUser(user)
      await fetchUserData(user.uid)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const register = async (email: string, password: string): Promise<AuthResponse> => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { exists: false, user: result.user }
  }

  const login = async (email: string, password: string): Promise<void> => {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    await fetchUserData(user.uid)
  }

  const loginWithGoogle = async (): Promise<AuthResponse> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    return { exists: userDoc.exists(), user: result.user }
  }

  const updateProfile = async (data: Partial<UserData>) => {
    if (!user) {
      throw new Error('No user logged in')
    }

    const updatedData = {
      ...data,
      updatedAt: new Date(),
    }

    await setDoc(doc(db, 'users', user.uid), updatedData, { merge: true })
    await fetchUserData(user.uid)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const value = {
    user,
    loading,
    login,
    register,
    updateProfile,
    loginWithGoogle,
    logout,
    resetPassword,
    createUserDocument,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
