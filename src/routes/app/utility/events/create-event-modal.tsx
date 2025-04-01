import React from 'react'
import { toast } from 'sonner'

import DateTimePicker24h from '@/components/date-time-picker24h'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context'
import { api, auth } from '@/lib'
import { DREvent } from '@/types'

const CreateDREventForm = () => {
  const [startDate, setStartDate] = React.useState<Date | undefined>()
  const [endDate, setEndDate] = React.useState<Date | undefined>()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.')
      return
    }
    if (!auth.currentUser || !user || !user.projectId) {
      return
    }
    try {
      const event: Partial<DREvent> = {
        utility_id: user.projectId,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      }
      const token = await auth.currentUser.getIdToken()
      console.log({ startDate, endDate })
      await api.post(`/dr-events`, token, event)
    } catch (error) {
      toast.error('Failed to create DR Event')
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Start Date & Time</label>
        <DateTimePicker24h value={startDate} onChange={setStartDate} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">End Date & Time</label>
        <DateTimePicker24h value={endDate} onChange={setEndDate} />
      </div>

      <Button type="submit" className="w-full">
        Create Event
      </Button>
    </form>
  )
}

export default CreateDREventForm
