import { api, auth } from '@/lib'
import { Contract, UserData } from '@/types'

export interface NewContractInput {
  offloadAmount: number
}

// Fetch all contracts for a user
export const fetchContracts = async (user: UserData): Promise<Contract[]> => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }
  try {
    const token = await auth.currentUser.getIdToken()
    //NEED AN API FOR THIS
    const { data, status } = await api.get(`/contracts/project/${user.projectId}`, token)
    if (status === 200) {
      return data as Contract[]
    } else {
      console.error(`Failed to fetch contracts: Status ${status}`)
      return []
    }
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return []
  }
}

// Create a new contract
export const createContract = async (user: UserData, newContract: NewContractInput) => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    const token = await auth.currentUser.getIdToken()

    // Format dates for our DB
    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 365) // One year contract

    const contractData = {
      id: 'string', // not sure how this is genereated
      contract_threshold: newContract.offloadAmount,
      start_date: today.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: 'active',
      project_id: user.projectId,
    }

    const { status } = await api.post('/contracts', token, contractData)
    if (status === 201) {
      console.log('Contract created successfully:')
      return true
    } else {
      console.error(`Failed to create contract: Status ${status}`)
      return null
    }
  } catch (error) {
    console.error('Error creating contract:', error)
    return null
  }
}

// Delete a contract
export const deleteContract = async (user: UserData, contractId: string): Promise<boolean> => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    const token = await auth.currentUser.getIdToken()
    //NEED TO SEE HOW WE GET CONTRACTID
    const { status } = await api.delete(`/contracts/${contractId}`, token)

    if (status === 200 || status === 204) {
      return true
    } else {
      console.error(`Failed to delete contract: Status ${status}`)
      return false
    }
  } catch (error) {
    console.error('Error deleting contract:', error)
    return false
  }
}

// Get contract by ID
export const fetchContractById = async (contractId: string): Promise<Contract | null> => {
  if (!auth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    const token = await auth.currentUser.getIdToken()
    const { data, status } = await api.get(`/contracts/${contractId}`, token)

    if (status === 200) {
      return data as Contract
    } else {
      console.error(`Failed to fetch contract: Status ${status}`)
      return null
    }
  } catch (error) {
    console.error(`Error fetching contract ${contractId}:`, error)
    return null
  }
}
