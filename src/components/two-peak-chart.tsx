import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart'

const energyData = [
  { time: '3 AM', demand: 2200 },
  { time: '6 AM', demand: 2200, lepreau: 1600, hydro: 0, moreHydro: 0, fossil: 0 },
  { time: '8 AM', demand: 3000, lepreau: 2200, hydro: 200, moreHydro: 300, fossil: 300 },
  { time: '9 AM', demand: 2200, lepreau: 1600, hydro: 0, moreHydro: 0, fossil: 0 },
  { time: '3 PM', demand: 2200 },
  { time: '4 PM', demand: 2200 },
  { time: '5 PM', demand: 2700 },
  { time: '8 PM', demand: 2200 },
  { time: '9 PM', demand: 2200 },
]

const chartConfig = {
  demand: {
    label: 'Demand Curve',
    color: 'hsl(var(--chart-1))',
  },
  lepreau: {
    label: 'Lepreau + Belledune',
    color: 'hsl(var(--chart-2))',
  },
  hydro: {
    label: 'Hydro, Wind, Biomass, Gas',
    color: 'hsl(var(--chart-3))',
  },
  moreHydro: {
    label: 'More Hydro + Interconnections',
    color: 'hsl(var(--chart-4))',
  },
  fossil: {
    label: 'Fossil Fuel',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export const TwoPeakChart = () => {
  return (
    <div className="py-56 px-10 bg-[#0C1629]">
      <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
        <AreaChart
          data={energyData}
          margin={{
            top: 20,
            right: 30,
            left: 30,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="fillLepreau" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-lepreau)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-lepreau)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillHydro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-hydro)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-hydro)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillMoreHydro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-moreHydro)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-moreHydro)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillFossil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-fossil)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-fossil)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={['6 AM', '9 AM', '4 PM', '8 PM']}
            tick={{ fontSize: 16 }} // Increase font size here
          />
          <YAxis
            domain={[2000, 3100]}
            allowDataOverflow={true}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            ticks={[2200, 3000]}
            tickFormatter={value => `${value} MW`}
            tick={{ fontSize: 16 }}
          />
          <Area
            dataKey="lepreau"
            type="monotone"
            fill="url(#fillLepreau)"
            stroke="var(--color-lepreau)"
            stackId="a"
          />
          <Area
            dataKey="hydro"
            type="monotone"
            fill="url(#fillHydro)"
            stroke="var(--color-hydro)"
            stackId="a"
          />
          <Area
            dataKey="moreHydro"
            type="monotone"
            fill="url(#fillMoreHydro)"
            stroke="var(--color-moreHydro)"
            stackId="a"
          />
          <Area
            dataKey="fossil"
            type="monotone"
            fill="url(#fillFossil)"
            stroke="var(--color-fossil)"
            stackId="a"
          />
          <Area
            dataKey="demand"
            type="monotone"
            fill="none"
            stroke="var(--color-demand)"
            strokeWidth={3}
          />
          <ChartLegend content={<ChartLegendContent className="text-[16px]" />} />
        </AreaChart>
      </ChartContainer>

      <div className="flex justify-center mt-6 text-sm text-muted-foreground">
        <div className="text-center pr-28 pl-20">
          <div className="font-medium text-base">Morning Peak</div>
          <div>6 AM &mdash; 9 AM</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-base">Valley</div>
          <div>11 AM &mdash; 3 PM</div>
        </div>
        <div className="text-center pl-32">
          <div className="font-medium text-base">Evening Peak</div>
          <div>4 PM &mdash; 8 PM</div>
        </div>
      </div>
    </div>
  )
}
