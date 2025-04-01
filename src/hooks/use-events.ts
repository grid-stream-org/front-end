// I am putting this in the hooks directory in case we want to reuse it, maybe for dashboard.
import { api, auth } from '@/lib'
import { DREvent, UserData } from '@/types'

export const fetchEvents = async (user: UserData, role: string): Promise<DREvent[]> => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    const token = await auth.currentUser.getIdToken()
    const endpoint =
      role === 'Residential'
        ? `/dr-events/project/${user.projectId}`
        : `/dr-events/utility/${user.projectId}`

    const { data, status } = await api.get(endpoint, token)

    if (status === 200) {
      return data as DREvent[]
    } else {
      console.error(`Failed to fetch events: Status ${status}`)
      return []
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}
