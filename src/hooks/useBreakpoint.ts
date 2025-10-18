import { useEffect, useState } from 'react'

const breakpoints: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

type Direction = 'up' | 'down' | 'only'

export function useBreakpoint(
  breakpoint: keyof typeof breakpoints,
  direction: Direction = 'down'
) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const px = breakpoints[breakpoint]
    const keys = Object.keys(breakpoints)
    const idx = keys.indexOf(breakpoint)
    const nextBp = keys[idx + 1] ? breakpoints[keys[idx + 1]] : undefined

    const queryMap: Record<Direction, string> = {
      down: `(max-width: ${px - 0.1}px)`,
      up: `(min-width: ${px}px)`,
      only: nextBp
        ? `(min-width: ${px}px) and (max-width: ${nextBp - 0.1}px)`
        : `(min-width: ${px}px)`,
    }

    const query = queryMap[direction]
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const cb = (ev: MediaQueryListEvent) => setMatches(ev.matches)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }, [breakpoint, direction])

  return matches
}
