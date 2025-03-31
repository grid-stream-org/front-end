import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CardProps {
  title: string
  value: number | string
}

export const InfoCard = ({ info }: { info: CardProps }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{info.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-bold">{info.value}</p>
      </CardContent>
    </Card>
  )
}
