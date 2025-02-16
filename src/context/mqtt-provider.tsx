import { Buffer } from 'node:buffer'

import mqtt, { MqttClient, IClientOptions } from 'mqtt'
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

import { useAuth } from '@/context'
import { DeviceRegistrar } from '@/lib'
import { DER, DERData } from '@/types'

interface MqttContextValue {
  data: DERData[] | null
  devices: DER[]
  isConnected: boolean
  error: Error | null
  // eslint-disable-next-line no-unused-vars
  updateDevice: (der: DER, power_capacity: number) => Promise<void>
}

const MqttContext = createContext<MqttContextValue | undefined>(undefined)

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DERData[] | null>(null)
  const [devices, setDevices] = useState<DER[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const refs = useRef({
    client: null as MqttClient | null,
    deviceRegistrar: null as DeviceRegistrar | null,
    isMounted: false,
  }).current

  // Move these functions inside useEffect to avoid the dependency issue
  useEffect(() => {
    const connectClient = async (projectId: string): Promise<void> => {
      if (!refs.deviceRegistrar) {
        refs.deviceRegistrar = await DeviceRegistrar.create(projectId)
        setDevices(refs.deviceRegistrar.getDevices())
      }

      const clientId = 'clientId-' + Math.random().toString(16)
      const host = import.meta.env.VITE_MQTT_HOST as string
      const port = import.meta.env.VITE_MQTT_PORT as string
      const brokerUrl = `wss://${host}:${port}/mqtt`
      const topic = `projects/${projectId}`

      const options: IClientOptions = {
        username: import.meta.env.VITE_MQTT_USERNAME as string,
        password: import.meta.env.VITE_MQTT_PASSWORD as string,
        clientId,
        rejectUnauthorized: true,
      }

      const client: MqttClient = mqtt.connect(brokerUrl, options)
      refs.client = client

      client.on('connect', () => {
        setIsConnected(true)
        setError(null)
        const qos = (Number(import.meta.env.VITE_MQTT_QOS) || 0) as 0 | 1 | 2
        client.subscribe(topic, { qos }, err => {
          if (err) {
            setError(err)
          }
        })
      })

      client.on('message', async (receivedTopic: string, message: Buffer) => {
        if (receivedTopic === topic) {
          const derData = JSON.parse(message.toString()) as DERData[]
          setData(derData)

          if (refs.deviceRegistrar) {
            const ders = derData.map(der => ({
              id: der.der_id,
              project_id: der.project_id,
              type: der.type,
              nameplate_capacity: der.nameplate_capacity,
              power_capacity: der.nameplate_capacity,
            }))

            for (const der of ders) {
              await refs.deviceRegistrar.resolve(der)
            }
            setDevices(refs.deviceRegistrar.getDevices())
          }
        }
      })

      client.on('error', (err: Error) => {
        setError(err)
        setIsConnected(false)
      })
    }

    const disconnectClient = (): void => {
      if (refs.client) {
        refs.client.end()
        refs.client = null
      }
      setIsConnected(false)
    }

    refs.isMounted = true

    if (user) {
      connectClient(user.projectId)
    } else {
      disconnectClient()
    }

    return () => {
      refs.isMounted = false
      disconnectClient()
      refs.deviceRegistrar = null
    }
  }, [user, refs]) // refs is stable so this won't cause re-renders

  const updateDevice = async (device: DER, power_capacity: number) => {
    if (power_capacity > device.nameplate_capacity) {
      throw new Error('Power capacity cannot exceed nameplate capacity')
    }

    if (refs.deviceRegistrar) {
      await refs.deviceRegistrar.update(device, power_capacity)
      setDevices(refs.deviceRegistrar.getDevices())
    }
  }

  const value: MqttContextValue = { data, isConnected, error, devices, updateDevice }
  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>
}

export const useMqttData = () => {
  const context = useContext(MqttContext)
  if (context === undefined) {
    throw new Error('useMqttData must be used within a MqttProvider')
  }
  return context
}
