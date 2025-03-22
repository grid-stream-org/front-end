import { api, auth } from '@/lib'
import { UserData } from '@/types'

export interface OffloadData {
  project_id: string
  start_time: string
  end_time: string
  baseline: number
  contract_threshold: number
  average_output: number
}

export const fetchProjectAverages = async (
  user: UserData,
  startTime: string,
  endTime: string,
): Promise<OffloadData[]> => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    const startDate = new Date(startTime).toISOString()
    const endDate = new Date(endTime).toISOString()
    const token = await auth.currentUser.getIdToken()
    const { data, status } = await api.get(
      `/project-averages?project_id=${encodeURIComponent(user.projectId)}&start_time=${encodeURIComponent(startDate)}&end_time=${encodeURIComponent(endDate)}`,
      token,
    )

    if (status === 200) {
      return data as OffloadData[]
    } else {
      console.error(`Failed to fetch project averages: Status ${status}`)
      return []
    }
  } catch (error) {
    console.error('Error fetching project averages:', error)
    return []
  }
}
