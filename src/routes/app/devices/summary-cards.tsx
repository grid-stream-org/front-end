import { BatteryCharging, Wind, Zap } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { DER } from '@/types'

export const SummaryCards = ({
  devices,
  isConnected,
}: {
  devices: DER[]
  isConnected: boolean
}) => {
  const totalPowerCapacity = devices?.reduce((sum, device) => sum + device.power_capacity, 0) || 0
  const totalNameplateCapacity =
    devices?.reduce((sum, device) => sum + device.nameplate_capacity, 0) || 0

  return (
    <div className="grid gap-8 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <BatteryCharging className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{devices?.length || 0}</div>
          <p className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Live Connection' : 'Disconnected'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nameplate Capacity</CardTitle>
          <Wind className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNameplateCapacity.toFixed(2)} kW</div>
          <p className="text-xs text-muted-foreground">Maximum potential output</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Power Capacity</CardTitle>
          <Zap className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPowerCapacity.toFixed(2)} kW</div>
          <p className="text-xs text-muted-foreground">Across all devices</p>
        </CardContent>
      </Card>
    </div>
  )
}
