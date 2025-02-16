import { ApiClient, api, auth } from '@/lib'
import { DER } from '@/types'

export class DeviceRegistrar {
  private projectId: string
  private devices: Map<string, DER>
  private api: ApiClient
  private initialized: boolean = false
  private pendingResolves: Set<string>

  private constructor(projectId: string) {
    this.projectId = projectId
    this.devices = new Map()
    this.api = api
    this.pendingResolves = new Set()
  }

  static async create(projectId: string): Promise<DeviceRegistrar> {
    const instance = new DeviceRegistrar(projectId)
    await instance.init()
    instance.initialized = true
    return instance
  }

  private async init() {
    if (!auth.currentUser) {
      return
    }
    const token = await auth.currentUser.getIdToken()
    const { data, status } = await this.api.get('/der-metadata', token, {
      project_id: this.projectId,
    })

    if (status === 200) {
      const ders = data as DER[]
      ders.forEach(der => this.devices.set(der.id, der))
    }
  }

  public async update(der: DER, power_capacity: number) {
    if (!auth.currentUser) {
      throw new Error('Unable to update device. Please try again later')
    }
    const token = await auth.currentUser.getIdToken()
    await this.api.put(`/der-metadata/${der.id}`, token, { power_capacity })
    this.devices.set(der.id, { ...der, power_capacity })
  }

  public async resolve(der: DER) {
    if (this.devices.has(der.id) || this.pendingResolves.has(der.id)) {
      return
    }

    if (!auth.currentUser) {
      return
    }

    try {
      this.pendingResolves.add(der.id)
      const token = await auth.currentUser.getIdToken()
      const { data, status } = await this.api.get(`/der-metadata/${der.id}`, token)

      if (status === 200) {
        const dbDer = data as DER
        this.devices.set(dbDer.id, dbDer)
      } else if (status === 404) {
        await this.api.post(`/der-metadata`, token, der)
        this.devices.set(der.id, der)
      }
    } finally {
      this.pendingResolves.delete(der.id)
    }
  }

  public getDevices(): DER[] {
    if (!this.initialized) {
      throw new Error('DeviceRegistrar not initialized')
    }
    return Array.from(new Set(this.devices.values()))
  }
}
