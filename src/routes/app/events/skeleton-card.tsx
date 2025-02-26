// skeli cards for when we are loading
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const SkeletonCard = () => (
  <Card className="rounded-xl shadow-sm overflow-hidden mb-4">
    <div className="h-1 bg-gray-200" />
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
)
