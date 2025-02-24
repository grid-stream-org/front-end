import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

const SAMPLE_DATA = [
  { date: new Date('2025-02-24T19:00:00').getTime(), value1: 10, value2: 100, value3: 80 },
  { date: new Date('2025-02-24T19:05:00').getTime(), value1: 15, value2: 105, value3: 85 },
  { date: new Date('2025-02-24T19:15:00').getTime(), value1: 20, value2: 110, value3: 90 },
  { date: new Date('2025-02-24T19:20:00').getTime(), value1: 18, value2: 115, value3: 95 },
  { date: new Date('2025-02-24T19:25:00').getTime(), value1: 22, value2: 120, value3: 100 },
  { date: new Date('2025-02-24T19:30:00').getTime(), value1: 25, value2: 118, value3: 98 },
  { date: new Date('2025-02-24T19:35:00').getTime(), value1: 28, value2: 116, value3: 96 },
  { date: new Date('2025-02-24T19:40:00').getTime(), value1: 30, value2: 114, value3: 94 },
  { date: new Date('2025-02-24T19:45:00').getTime(), value1: 26, value2: 112, value3: 92 },
  { date: new Date('2025-02-24T19:50:00').getTime(), value1: 24, value2: 110, value3: 90 },
  { date: new Date('2025-02-24T19:55:00').getTime(), value1: 20, value2: 108, value3: 88 },
  { date: new Date('2025-02-24T20:00:00').getTime(), value1: 18, value2: 106, value3: 86 },
]

export const StaticChart = () => {
  return (
    <Card className="w-full">
      <CardHeader className="py-5">
        <CardTitle>System Performance</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="flex flex-col md:flex-row">
          {/* Chart container: 66% on larger screens, full width on small screens */}
          <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-8">
            <ResponsiveContainer width="100%" height="100%" aspect={3 / 2}>
              <LineChart data={SAMPLE_DATA} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  type="number"
                  tickFormatter={val =>
                    new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                  tick={{ className: 'text-black dark:text-white' }} // Text is white in dark mode
                  tickLine={false}
                  axisLine={false}
                  minTickGap={20}
                  domain={['auto', 'auto']}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickFormatter={val => `${val.toFixed(0)} kW`}
                  tick={{ className: 'text-black dark:text-white' }} // Text is white in dark mode
                  tickLine={false}
                  axisLine={false}
                />
                <Line
                  dataKey="value1"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                  name="Power Measurement"
                />
                <Line
                  dataKey="value2"
                  stroke="#FF6347"
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                  name="Baseline"
                />
                <Line
                  dataKey="value3"
                  stroke="#808080"
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                  name="Contract Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend container: 33% on larger screens, full width on small screens */}
          <div className="w-full md:w-1/3 flex flex-col justify-center pl-0 md:pl-4">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-[#4F46E5] mr-2" />
              <span className="text-foreground">Power Reduction</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-[#FF6347] mr-2" />
              <span className="text-foreground">Baseline</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#808080] mr-2" />
              <span className="text-foreground">Meter Measurement</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
