import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  {
    date: new Date('2025-02-24T19:00:00').getTime(),
    Reduction: 10,
    Baseline: 102,
    Measurement: 78,
  },
  {
    date: new Date('2025-02-24T19:05:00').getTime(),
    Reduction: 15,
    Baseline: 108,
    Measurement: 83,
  },
  {
    date: new Date('2025-02-24T19:15:00').getTime(),
    Reduction: 20,
    Baseline: 112,
    Measurement: 92,
  },
  {
    date: new Date('2025-02-24T19:20:00').getTime(),
    Reduction: 18,
    Baseline: 118,
    Measurement: 97,
  },
  {
    date: new Date('2025-02-24T19:25:00').getTime(),
    Reduction: 22,
    Baseline: 122,
    Measurement: 101,
  },
  {
    date: new Date('2025-02-24T19:30:00').getTime(),
    Reduction: 25,
    Baseline: 119,
    Measurement: 96,
  },
  {
    date: new Date('2025-02-24T19:35:00').getTime(),
    Reduction: 28,
    Baseline: 113,
    Measurement: 94,
  },
  {
    date: new Date('2025-02-24T19:40:00').getTime(),
    Reduction: 30,
    Baseline: 117,
    Measurement: 99,
  },
  {
    date: new Date('2025-02-24T19:45:00').getTime(),
    Reduction: 26,
    Baseline: 110,
    Measurement: 89,
  },
  {
    date: new Date('2025-02-24T19:50:00').getTime(),
    Reduction: 24,
    Baseline: 108,
    Measurement: 85,
  },
  {
    date: new Date('2025-02-24T19:55:00').getTime(),
    Reduction: 20,
    Baseline: 105,
    Measurement: 87,
  },
  {
    date: new Date('2025-02-24T20:00:00').getTime(),
    Reduction: 18,
    Baseline: 107,
    Measurement: 90,
  },
]

const formatXAxis = tick => {
  return new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const StaticChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="date" tickFormatter={formatXAxis} />
        <YAxis />
        <Tooltip labelFormatter={formatXAxis} />
        <Legend />
        <Line type="monotone" dataKey="Reduction" stroke="#c1121f" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Baseline" stroke="#669bbc" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Measurement" stroke="#ff7300" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default StaticChart
