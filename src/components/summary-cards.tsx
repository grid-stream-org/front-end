import { LucideIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'

interface SummaryCardItem {
  title: string
  value: string | number
  icon: LucideIcon
  subtitle: string
  subtitleColor?: string
}

interface SummaryCardsProps {
  items: SummaryCardItem[]
  className?: string
}

export const SummaryCards = ({
  items,
  className = 'grid gap-8 md:grid-cols-3 mb-8',
}: SummaryCardsProps) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className={`text-xs ${item.subtitleColor ?? 'text-muted-foreground'}`}>
              {item.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
