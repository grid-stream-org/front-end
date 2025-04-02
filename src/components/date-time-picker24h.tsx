'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
  value?: Date
  // this does get used when parent component changes date idk why its complaining, used to update date
  // eslint-disable-next-line no-unused-vars
  onChange: (date: Date) => void
}

const DateTimePicker24h = ({ value, onChange }: DateTimePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    const updated = new Date(selectedDate)
    updated.setHours(value?.getHours() ?? 0)
    updated.setMinutes(value?.getMinutes() ?? 0)
    onChange(updated)
  }

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    if (!value) return
    const updated = new Date(value)
    if (type === 'hour') updated.setHours(parseInt(val))
    if (type === 'minute') updated.setMinutes(parseInt(val))
    onChange(updated)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'MM/dd/yyyy HH:mm') : <span>MM/DD/YYYY hh:mm</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={value} onSelect={handleDateSelect} initialFocus />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map(hour => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={value?.getHours() === hour ? 'default' : 'ghost'}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map(minute => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={value?.getMinutes() === minute ? 'default' : 'ghost'}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange('minute', minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePicker24h
