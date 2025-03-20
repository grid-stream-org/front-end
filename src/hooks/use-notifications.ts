import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/context'
import { Notification } from '@/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const db = getFirestore()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'notifications'),
      where('project_id', '==', user?.projectId),
      orderBy('start_time', 'desc'),
      limit(10),
    )
    try {
      const unsubscribe = onSnapshot(q, snapshot => {
        const newNotifs: Notification[] = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<Notification, 'id'>
          return { id: doc.id, ...data }
        })
        setNotifications(newNotifs)
      })

      return () => unsubscribe()
    } catch (error) {
      toast.error('Failed to fetch notifications')
      console.error(error)
    }
  }, [db, user])

  return notifications
}
