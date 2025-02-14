import { useEffect, useState } from 'react'

// Hook that updates the current time continuously.
export const useNow = () => {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const tick = () => {
      setNow(Date.now())
      requestAnimationFrame(tick)
    }
    const frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])
  return now
}
