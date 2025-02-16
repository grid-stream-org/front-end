// device-dialog.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getDeviceIcon } from './device-table'

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Separator,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui'
import { handleError } from '@/lib'
import { DER, deviceFormSchema, type DeviceFormValues } from '@/types'

interface DeviceDialogProps {
  device: DER
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void
  // eslint-disable-next-line no-unused-vars
  onUpdatePowerCapacity: (device: DER, newPowerCapacity: number) => Promise<void>
}

export const DeviceDialog = ({
  device,
  open,
  onOpenChange,
  onUpdatePowerCapacity,
}: DeviceDialogProps) => {
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: {
      power_capacity: device.power_capacity.toString(),
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: DeviceFormValues) => {
    try {
      setIsLoading(true)
      await onUpdatePowerCapacity(device, parseFloat(values.power_capacity))
      onOpenChange(false)
    } catch (error) {
      form.setError('power_capacity', {
        message: handleError(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getDeviceIcon(device.type)}
            <DialogTitle>Device Details</DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Device Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <p className="font-medium capitalize">{device.type}</p>
                  </div>
                  <div>
                    <Label>Device ID</Label>
                    <p className="font-medium">{device.id}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Capacity Settings</Label>
                <div className="grid gap-4">
                  <div>
                    <Label>Nameplate Capacity</Label>
                    <p className="font-medium">{device.nameplate_capacity.toFixed(2)} kW</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="power_capacity"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label>Power Capacity</Label>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <span className="text-muted-foreground">kW</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
