import { Buffer } from 'node:buffer'

import mqtt, { MqttClient, IClientOptions } from 'mqtt'
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

import { useAuth } from '@/context'
import { DERData } from '@/types'

interface MqttContextValue {
  data: DERData[] | null
  isConnected: boolean
  error: Error | null
}

const MqttContext = createContext<MqttContextValue | undefined>(undefined)

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DERData[] | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  const clientRef = useRef<MqttClient | null>(null)

  const connectClient = (topic: string): void => {
    const clientId = 'clientId-' + Math.random().toString(16)
    const host = import.meta.env.VITE_MQTT_HOST as string
    const port = import.meta.env.VITE_MQTT_PORT as string
    const brokerUrl = `wss://${host}:${port}/mqtt`

    const options: IClientOptions = {
      username: import.meta.env.VITE_MQTT_USERNAME as string,
      password: import.meta.env.VITE_MQTT_PASSWORD as string,
      clientId,
      rejectUnauthorized: true,
    }

    const client: MqttClient = mqtt.connect(brokerUrl, options)
    clientRef.current = client

    client.on('connect', () => {
      console.log('Connected to broker')
      setIsConnected(true)
      setError(null)

      const qos = (Number(import.meta.env.VITE_MQTT_QOS) || 0) as 0 | 1 | 2
      client.subscribe(topic, { qos }, err => {
        if (err) {
          console.error(`Failed to subscribe: ${err.message}`)
        } else {
          console.log(`Subscribed to topic: ${topic}`)
        }
      })
    })

    client.on('message', (receivedTopic: string, message: Buffer) => {
      if (receivedTopic === topic) {
        try {
          const parsedData = JSON.parse(message.toString()) as DERData[]
          setData(parsedData)
        } catch (e) {
          console.error('Error parsing message', e)
        }
      }
    })

    client.on('error', (err: Error) => {
      console.error('MQTT Client Error:', err)
      setError(err)
      setIsConnected(false)
    })
  }

  const disconnectClient = (): void => {
    if (clientRef.current) {
      clientRef.current.end()
      console.log('Disconnected from MQTT broker')
    }
  }

  useEffect(() => {
    if (!user) {
      disconnectClient()
      return
    }
    const topic = `projects/${user.projectId}`
    connectClient(topic)
    return () => {
      disconnectClient()
    }
  }, [user])

  const value: MqttContextValue = { data, isConnected, error }

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>
}

export const useMqttData = () => {
  const context = useContext(MqttContext)
  if (context === undefined) {
    throw new Error('useMqttData must be used within a MqttProvider')
  }
  return context
}
