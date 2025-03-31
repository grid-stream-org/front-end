import { useState, useEffect } from 'react'

import { DemandResponseEvent } from './dr-events'
import { InfoCard } from './info-card'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context'
import { fetchProjectSummary } from '@/hooks/use-project-summary'
import { ProjectSummary } from '@/types'

const UtilityDashBoard = () => {
  const { user } = useAuth()
  const [summary, setSummary] = useState<ProjectSummary | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user || !user.projectId) return

    const loadSummary = async () => {
      setLoading(true)
      try {
        const data = await fetchProjectSummary(user)
        setSummary(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
        setSummary(null)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [user])

  const refreshSummary = async () => {
    if (!user || !user.projectId) return

    setLoading(true)
    try {
      const data = await fetchProjectSummary(user)
      setSummary(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="animate-pulse">Loading data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
          <button
            onClick={refreshSummary}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p>No data available</p>
          <Button variant="default" className="dark:text-white" onClick={refreshSummary}>
            Refresh Data
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Utility Summary</h2>
        <Button variant="default" className="dark:text-white" onClick={refreshSummary}>
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <InfoCard
          info={{
            title: 'Active Contracts',
            value: summary.total_active,
          }}
        />
        <InfoCard
          info={{
            title: 'Pending Contracts',
            value: summary.total_pending,
          }}
        />
        <InfoCard
          info={{
            title: 'Total Contracted Power',
            value: summary.total_threshold,
          }}
        />
      </div>

      <div className="mt-8">
        <DemandResponseEvent
          events={{
            nextEventId: summary.next_event_id,
            nextEventStart: summary.next_event_start,
            nextEventEnd: summary.next_event_end,
            recentEventId: summary.recent_event_id,
            recentEventStart: summary.recent_event_start,
            recentEventEnd: summary.recent_event_end,
          }}
        />
      </div>
    </div>
  )
}

export default UtilityDashBoard
