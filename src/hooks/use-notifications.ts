import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { useAuth } from '@/context'
import { Notification } from '@/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const auth = getAuth()
  const db = getFirestore()
  const { user } = useAuth()

  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const q = query(
      collection(db, 'notifications'),
      where('project_id', '==', user?.projectId), // Use project_id instead of uid
    )
    console.log(currentUser.uid)

    const unsubscribe = onSnapshot(q, snapshot => {
      const newNotifs: Notification[] = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Notification, 'id'> // Exclude 'id' to prevent duplicate
        return { id: doc.id, ...data } // Ensure 'id' is only added once
      })

      setNotifications(newNotifs)
    })

    return () => unsubscribe()
  }, [auth.currentUser, db, user?.projectId])

  return notifications
}
