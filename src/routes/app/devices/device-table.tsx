// src/components/devices/device-table.tsx
import { Battery, BatteryCharging, Car, Search, Zap, Pencil, CloudAlert } from 'lucide-react'
import { useState } from 'react'

import { DeviceDialog } from './device-dialog'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { DER } from '@/types'

export const getDeviceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'battery':
      return <Battery className="h-4 w-4" />
    case 'solar':
      return <Zap className="h-4 w-4" />
    case 'ev':
      return <Car className="h-4 w-4" />
    default:
      return <BatteryCharging className="h-4 w-4" />
  }
}

const TableSkeleton = () => (
  <TableBody>
    {[...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-32" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-16 ml-auto" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-16 ml-auto" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 ml-auto rounded-full" />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
)

const EmptyState = () => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
          <BatteryCharging className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No devices discovered yet</p>
        </div>
      </TableCell>
    </TableRow>
  </TableBody>
)

const ErrorState = ({ error }: { error: Error | null }) => (
  <TableBody>
    <TableRow>
      <TableCell colSpan={5} className="h-24 text-center">
        <div className="flex flex-col items-center gap-2">
          <CloudAlert size={36} className="text-destructive" />
          <p className="text-sm text-destructive">
            Error: {error ? error.message : 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      </TableCell>
    </TableRow>
  </TableBody>
)

interface DeviceTableProps {
  devices: DER[]
  isConnected: boolean
  error: Error | null
  // eslint-disable-next-line no-unused-vars
  onUpdatePowerCapacity: (device: DER, newPowerCapacity: number) => Promise<void>
}

export const DeviceTable = ({
  devices,
  isConnected,
  error,
  onUpdatePowerCapacity,
}: DeviceTableProps) => {
  const [search, setSearch] = useState('')
  const [selectedDevice, setSelectedDevice] = useState<DER | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredDevices = devices?.filter(
    device =>
      device.id.toLowerCase().includes(search.toLowerCase()) ||
      device.type.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Discovered distributed energy resources</CardDescription>
        <div className="flex items-center py-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8"
              disabled={!isConnected || !devices}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Device ID</TableHead>
              <TableHead className="text-right">Nameplate Capacity (kW)</TableHead>
              <TableHead className="text-right">Power Capacity (kW)</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          {!isConnected ? (
            <TableSkeleton />
          ) : !devices || devices.length === 0 ? (
            <EmptyState />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <TableBody>
              {filteredDevices.map(device => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(device.type)}
                      <span className="capitalize">{device.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{device.id}</TableCell>
                  <TableCell className="text-right">
                    {device.nameplate_capacity.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{device.power_capacity.toFixed(2)}</TableCell>
                  <TableCell className="flex justify-end">
                    <Pencil
                      className="w-4 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedDevice(device)
                        setDialogOpen(true)
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>

      {selectedDevice && (
        <DeviceDialog
          device={selectedDevice}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onUpdatePowerCapacity={onUpdatePowerCapacity}
        />
      )}
    </Card>
  )
}
