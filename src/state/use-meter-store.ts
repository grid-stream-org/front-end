import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DataPoint, MeterState } from '@/types'

const ONE_HOUR = 2 * 60 * 60 * 1000

export const useMeterStore = create<MeterState>()(
  persist(
    (set, get) => ({
      data: [],
      addDataPoint: (point: DataPoint) => {
        const updated = [...get().data, { ...point, date: point.date }].sort(
          (a, b) => a.date - b.date,
        )

        // Keep only points within the last hour
        const cutoff = Date.now() - ONE_HOUR
        set({ data: updated.filter(p => p.date > cutoff) })
      },
      cleanOldData: () => {
        const cutoff = Date.now() - ONE_HOUR
        set(state => ({
          data: state.data.filter(p => p.date > cutoff),
        }))
      },
    }),
    {
      name: 'meter-storage',
      partialize: state => ({ data: state.data }),
    },
  ),
)
