import { Activity, Clock, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

import { SummaryCards, PageTitle } from '@/components'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { getAppRoute } from '@/config'
import { useAuth } from '@/context'
import { fetchProjectSummary } from '@/hooks/use-project-summary'
import { ProjectSummary } from '@/types'

const UtilityDashboard = () => {
  const { user } = useAuth()
  const [summary, setSummary] = useState<ProjectSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user || !user.projectId) {
      setLoading(false)
      return
    }

    const loadSummary = async () => {
      try {
        const data = await fetchProjectSummary(user)
        setSummary(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [user])

  if (loading) {
    return (
      <>
        <PageTitle route={getAppRoute(location.pathname)} />
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {[1, 2, 3].map(idx => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <PageTitle route={getAppRoute(location.pathname)} />
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </>
    )
  }

  if (!summary) {
    return (
      <>
        <PageTitle route={getAppRoute(location.pathname)} />
        <div className="text-center py-8">
          <p>No data available</p>
        </div>
      </>
    )
  }

  const summaryItems = [
    {
      title: 'Active Contracts',
      value: summary.total_active,
      icon: Activity,
      subtitle: 'Currently active utility contracts',
    },
    {
      title: 'Pending Contracts',
      value: summary.total_pending,
      icon: Clock,
      subtitle: 'Contracts awaiting approval',
    },
    {
      title: 'Total Contracted Power',
      value: `${summary.total_threshold} kW`,
      icon: Zap,
      subtitle: 'Combined power capacity',
    },
  ]

  return (
    <>
      <PageTitle route={getAppRoute(location.pathname)} />
      <SummaryCards items={summaryItems} />
    </>
  )
}

export default UtilityDashboard
