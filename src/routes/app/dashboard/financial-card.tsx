import { DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context'
import { api, auth } from '@/lib'
import { DREvent, DataPoint, ProjectAverage } from '@/types'

interface FinancialImpactCardProps {
  data: DataPoint[]
  events: DREvent[]
  incentiveRate?: number
}

export const FinancialImpactCard = ({
  data,
  events,
  incentiveRate = 60,
}: FinancialImpactCardProps) => {
  const { user } = useAuth()
  const [avgReduction, setAvgReduction] = useState<number>(0)
  const [estimatedEarnings, setEstimatedEarnings] = useState<number>(0)
  const [yearlyProjection, setYearlyProjection] = useState<number>(0)
  const [progressValue, setProgressValue] = useState<number>(0)
  const [completedEvents, setCompletedEvents] = useState<number>(0)
  const [totalEvents, setTotalEvents] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [projectAverages, setProjectAverages] = useState<ProjectAverage[]>([])

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  useEffect(() => {
    const fetchProjectAverages = async () => {
      if (!user || !events.length) return

      setIsLoading(true)
      try {
        const token = await auth.currentUser?.getIdToken()
        const now = Date.now()
        const pastEvents = events
          .filter(event => event.end_time && new Date(event.end_time).getTime() < now)
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

        if (pastEvents.length === 0) {
          setIsLoading(false)
          return
        }

        const lastEvent = pastEvents[pastEvents.length - 1]

        // Format date range parameters
        const startDate = new Date(lastEvent.start_time).toISOString()
        const endDate = new Date(lastEvent.end_time).toISOString()

        const params = {
          project_id: user.projectId,
          start_time: startDate,
          end_time: endDate,
        }

        const { status, data } = await api.get('/project-averages', token, params)

        if (status === 200) {
          setProjectAverages(data as ProjectAverage[])
        }
      } catch (error) {
        console.error('Error fetching project averages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectAverages()
  }, [user, events])

  // Calculate financial data
  useEffect(() => {
    // Count completed and total events
    if (events?.length) {
      const now = Date.now()
      const completed = events.filter(
        event => event.end_time && new Date(event.end_time).getTime() < now,
      ).length

      setCompletedEvents(completed)
      setTotalEvents(events.length)

      // Calculate progress percentage
      if (events.length > 0) {
        setProgressValue((completed / events.length) * 100)
      }
    }

    let reduction = 0

    if (projectAverages.length > 0) {
      const totalReduction = projectAverages.reduce((sum, avg) => {
        const baseline = typeof avg.baseline === 'number' ? avg.baseline : 0
        const output = typeof avg.average_output === 'number' ? avg.average_output : 0
        return sum + (baseline - output)
      }, 0)

      reduction = totalReduction / projectAverages.length
    } else if (data?.length) {
      // Fallback to real-time data if historical not available
      const reductions = data.map(point => point.reduction || 0).filter(val => val > 0)
      if (reductions.length > 0) {
        reduction = reductions.reduce((sum, val) => sum + val, 0) / reductions.length
      }
    }

    setAvgReduction(Number(reduction.toFixed(2)))

    // Calculate earnings based on incentive rate
    const earnings = reduction * incentiveRate * completedEvents
    setEstimatedEarnings(earnings)

    // Project yearly earnings (assuming 12 events per year)
    const yearlyEvents = 12 // Maximum events per winter
    const perEventEarning = completedEvents > 0 ? earnings / completedEvents : 0
    const projectedYearly = perEventEarning * yearlyEvents
    setYearlyProjection(projectedYearly)
  }, [data, events, projectAverages, completedEvents, incentiveRate])

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="bg-primary text-white pb-8">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">Financial Impact</CardTitle>
            <CardDescription className="text-white/90 mt-1">
              Demand reduction earnings at ${incentiveRate}/kW
            </CardDescription>
          </div>
          <DollarSign className="h-7 w-7 text-white" />
        </div>
        <div className="mt-6">
          {isLoading ? (
            <Skeleton className="h-8 w-32 bg-white/30" />
          ) : (
            <>
              <p className="text-4xl font-bold">{formatCurrency(estimatedEarnings)}</p>
              <p className="text-white/90 mt-1">Estimated earnings to date</p>
            </>
          )}
        </div>
      </CardHeader>

      <div className="relative -mt-6">
        <CardContent className="pt-4 pb-4 bg-card z-10 relative rounded-t-xl">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Avg. Reduction</span>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-semibold">{avgReduction} kW</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Yearly Projection</span>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-semibold">
                      {formatCurrency(yearlyProjection)}
                    </span>
                    <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Events Completed</span>
                  </div>
                  <span className="text-sm font-medium">
                    {completedEvents} of {totalEvents}
                  </span>
                </div>
                <Progress value={progressValue} className="h-2 bg-secondary/20" />
              </div>
            </>
          )}

          <div className="text-xs text-muted-foreground text-center mt-4">
            Based on historical reduction data and $60/kW incentive rate
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
