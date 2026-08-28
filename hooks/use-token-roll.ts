import { useState, useEffect, useRef, useCallback } from "react"

// Animates a number from `from` to `to` using easeOut
export const useTokenRoll = (from: number, to: number, durationMs = 1200) => {
  const [current, setCurrent] = useState(from)
  const [rolling, setRolling] = useState(false)
  const rafRef = useRef<number | null>(null)

  const start = useCallback(() => {
    setRolling(true)
    const startTime = performance.now()
    const range = from - to

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      // Cubic easeOut
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(from - range * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCurrent(to)
        setRolling(false)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [from, to, durationMs])

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setCurrent(from)
    setRolling(false)
  }, [from])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return { current, rolling, start, reset }
}
