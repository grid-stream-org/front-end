import { Timestamp } from '@firebase/firestore'

export type Notification = {
  id: string
  userId: string
  message: string
  start_time: Timestamp
  end_time: Timestamp
  read: boolean
}
