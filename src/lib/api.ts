import axios, { AxiosInstance, AxiosResponse } from 'axios'

interface ApiConfig {
  baseURL: string
}

export interface ApiResponse<T> {
  data: T
  status: number
}

export class ApiError extends Error {
  constructor(
    public message: string,
    // eslint-disable-next-line no-unused-vars
    public status?: number,
    // eslint-disable-next-line no-unused-vars
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private client: AxiosInstance

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    })
  }

  async get<T>(
    path: string,
    token?: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<T>> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const response: AxiosResponse<T> = await this.client.get(path, {
        params,
        headers,
      })
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T, D>(path: string, data?: D, token?: string): Promise<ApiResponse<T>> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const response: AxiosResponse<T> = await this.client.post(path, data, {
        headers,
      })
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T, D>(path: string, data?: D, token?: string): Promise<ApiResponse<T>> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const response: AxiosResponse<T> = await this.client.put(path, data, {
        headers,
      })
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T>(path: string, token?: string): Promise<ApiResponse<T>> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const response: AxiosResponse<T> = await this.client.delete(path, {
        headers,
      })
      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      return new ApiError(
        error.response?.data?.message || error.message,
        error.response?.status,
        error.code,
      )
    }
    return new ApiError('An unexpected error occurred')
  }
}

export const api = new ApiClient({
  baseURL: 'https://api.gridstream.app/v1',
})
