import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DataPoint, MeterState } from '@/types'

// Exactly 1 hour in milliseconds
const ONE_HOUR = 60 * 60 * 1000

// Maximum number of data points to prevent storage quota issues
const MAX_DATA_POINTS = 3600

export const useMeterStore = create<MeterState>()(
  persist(
    (set, get) => ({
      data: [],

      addDataPoint: (point: DataPoint) => {
        // Add new point and sort by date
        let updated = [...get().data, { ...point, date: point.date }].sort(
          (a, b) => a.date - b.date,
        )

        // Apply both time-based and count-based limits
        const cutoff = Date.now() - ONE_HOUR
        updated = updated.filter(p => p.date > cutoff)

        // If still too many points after time filtering, cap by count
        if (updated.length > MAX_DATA_POINTS) {
          updated = updated.slice(-MAX_DATA_POINTS)
        }

        set({ data: updated })
      },

      cleanOldData: () => {
        const cutoff = Date.now() - ONE_HOUR

        set(state => {
          // First apply time-based filtering
          let filtered = state.data.filter(p => p.date > cutoff)

          // Then ensure we don't exceed maximum count
          if (filtered.length > MAX_DATA_POINTS) {
            filtered = filtered.slice(-MAX_DATA_POINTS)
          }

          return { data: filtered }
        })
      },
    }),
    {
      name: 'meter-storage',
      partialize: state => ({ data: state.data }),
    },
  ),
)
