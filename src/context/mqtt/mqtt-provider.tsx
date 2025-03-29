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

interface WorkerConnectedMessage {
  type: 'connected'
}

interface WorkerDisconnectedMessage {
  type: 'disconnected'
}

interface WorkerErrorMessage {
  type: 'error'
  error: string
}

interface WorkerDataMessage {
  type: 'data'
  topic: string
  payload: string
}

type WorkerMessage =
  | WorkerConnectedMessage
  | WorkerDisconnectedMessage
  | WorkerErrorMessage
  | WorkerDataMessage

const MqttContext = createContext<MqttContextValue | undefined>(undefined)

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DERData[] | null>(null)
  const [devices, setDevices] = useState<DER[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const refs = useRef({
    worker: null as Worker | null,
    deviceRegistrar: null as DeviceRegistrar | null,
    isMounted: false,
  }).current

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (refs.worker) {
        refs.worker.postMessage({
          type: 'visibility',
          isVisible: !document.hidden,
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refs.worker])

  useEffect(() => {
    const connectClient = async (projectId: string): Promise<void> => {
      if (!refs.deviceRegistrar) {
        refs.deviceRegistrar = await DeviceRegistrar.create(projectId)
        setDevices(refs.deviceRegistrar.getDevices())
      }

      if (!refs.worker) {
        refs.worker = new Worker(new URL('./mqtt-worker.ts', import.meta.url), { type: 'module' })

        refs.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
          if (!refs.isMounted) return

          const message = event.data

          switch (message.type) {
            case 'connected':
              setIsConnected(true)
              setError(null)
              break

            case 'disconnected':
              setIsConnected(false)
              break

            case 'error':
              setError(new Error(message.error))
              setIsConnected(false)
              break

            case 'data': {
              const topic = `projects/${projectId}`
              if (message.topic === topic) {
                try {
                  const derData = JSON.parse(message.payload) as DERData[]
                  setData(derData)

                  if (refs.deviceRegistrar) {
                    const ders = derData.map(der => ({
                      id: der.der_id,
                      project_id: der.project_id,
                      type: der.type,
                      nameplate_capacity: der.nameplate_capacity,
                      power_capacity: der.nameplate_capacity,
                    }))

                    Promise.all(ders.map(der => refs.deviceRegistrar?.resolve(der)))
                    setDevices(refs.deviceRegistrar.getDevices())
                  }
                } catch (err) {
                  console.error('Error parsing MQTT message:', err)
                  if (err instanceof Error) {
                    setError(err)
                  }
                }
              }
              break
            }
          }
        }

        const clientId = 'clientId-' + Math.random().toString(16).substring(2, 8)
        const host = import.meta.env.VITE_MQTT_HOST as string
        const port = import.meta.env.VITE_MQTT_PORT as string
        const brokerUrl = `wss://${host}:${port}/mqtt`
        const topic = `projects/${projectId}`

        const options = {
          username: import.meta.env.VITE_MQTT_USERNAME as string,
          password: import.meta.env.VITE_MQTT_PASSWORD as string,
          clientId,
          rejectUnauthorized: true,
          clean: true,
          keepalive: 5,
          reconnectPeriod: 500,
          connectTimeout: 10000,
          reschedulePings: true,
          protocolVersion: 5,
          resubscribe: true,
        }

        const qos = (Number(import.meta.env.VITE_MQTT_QOS) || 2) as 0 | 1 | 2

        // Send connect message to worker
        refs.worker.postMessage({
          type: 'connect',
          brokerUrl,
          options,
          topic,
          qos,
        })
      }
    }

    const disconnectClient = (): void => {
      if (refs.worker) {
        refs.worker.postMessage({ type: 'disconnect' })
        refs.worker.terminate()
        refs.worker = null
      }
      setIsConnected(false)
    }

    refs.isMounted = true

    if (user) {
      connectClient(user.projectId).catch(err => {
        console.error('Failed to connect MQTT client:', err)
        setError(err instanceof Error ? err : new Error(String(err)))
      })
    } else {
      disconnectClient()
    }

    return () => {
      refs.isMounted = false
      disconnectClient()
      refs.deviceRegistrar = null
    }
  }, [user, refs])

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
