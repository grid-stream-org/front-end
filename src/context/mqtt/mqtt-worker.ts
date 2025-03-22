import { Buffer } from 'node:buffer'

import mqtt, { MqttClient, IClientOptions } from 'mqtt'

let client: MqttClient | null = null

self.onmessage = e => {
  const message = e.data
  switch (message.type) {
    case 'connect':
      connectMqtt(message.brokerUrl, message.options, message.topic, message.qos)
      break
    case 'disconnect':
      disconnectMqtt()
      break
  }
}

const connectMqtt = (brokerUrl: string, options: IClientOptions, topic: string, qos: 0 | 1 | 2) => {
  if (client) {
    disconnectMqtt()
  }

  try {
    client = mqtt.connect(brokerUrl, options)

    client.on('connect', () => {
      self.postMessage({ type: 'connected' })

      client!.subscribe(topic, { qos }, err => {
        if (err) {
          self.postMessage({
            type: 'error',
            error: err.message || 'Failed to subscribe',
          })
        }
      })
    })

    client.on('message', (receivedTopic: string, message: Buffer) => {
      self.postMessage({
        type: 'data',
        topic: receivedTopic,
        payload: message.toString(),
      })
    })

    client.on('error', (err: Error) => {
      console.error('MQTT client error:', err)
      self.postMessage({
        type: 'error',
        error: err.message || 'Unknown MQTT error',
      })
    })

    client.on('offline', () => {
      self.postMessage({ type: 'disconnected' })
    })

    client.on('reconnect', () => {
      console.log('MQTT client attempting to reconnect...')
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    self.postMessage({
      type: 'error',
      error: errorMessage,
    })
  }
}

const disconnectMqtt = () => {
  if (client) {
    try {
      client.end(true)
      self.postMessage({ type: 'disconnected' })
    } catch (err) {
      console.error('Error disconnecting MQTT client:', err)
    } finally {
      client = null
    }
  }
}
