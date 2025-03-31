import { api, auth } from '@/lib'
import { ProjectSummary, UserData } from '@/types'

export const fetchProjectSummary = async (user: UserData): Promise<ProjectSummary | null> => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    //get rid of ""
    const utilityId = user.projectId.replace(/['"]/g, '')
    const token = await auth.currentUser.getIdToken()
    const { data, status } = await api.get(
      `/utilities/project-summary?utility_id=${utilityId}`,
      token,
    )
    if (status === 200) {
      return data as ProjectSummary
    } else {
      console.error(`Failed to fetch project summary: Status ${status}`)
      return null
    }
  } catch (error) {
    console.error('Error fetching project summary:', error)
    return null
  }
}
