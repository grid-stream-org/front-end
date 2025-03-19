// hook to mark notification as read when user reads it
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

export const useMarkNotification = () => {
  const db = getFirestore()

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId)
      await updateDoc(notifRef, { read: true })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return { markNotificationAsRead }
}
