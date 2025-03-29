// hook to mark notification as read when user reads it
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

export const useMarkNotification = () => {
  const db = getFirestore()

  const markNotificationAsRead = async (notificationId: string) => {
    const notifRef = doc(db, 'notifications', notificationId)
    await updateDoc(notifRef, { read: true })
  }

  return { markNotificationAsRead }
}
