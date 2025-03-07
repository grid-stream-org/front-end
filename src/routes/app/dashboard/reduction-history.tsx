import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { time: '14:00', offload: 10 },
  { time: '14:30', offload: 20 },
  { time: '15:00', offload: 35 },
  { time: '15:30', offload: 50 },
  { time: '16:00', offload: 55 },
]

const OffloadHistoryChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offload History (Last Event)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="offload" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default OffloadHistoryChart
