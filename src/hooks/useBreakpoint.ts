import { useEffect, useState } from 'react'

const breakpoints: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

type Direction = 'up' | 'down' | 'only'

const getMediaQuery = (
  breakpoint: keyof typeof breakpoints,
  direction: Direction
): string => {
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

  return queryMap[direction]
}

export function useBreakpoint(
  breakpoint: keyof typeof breakpoints,
  direction: Direction = 'down'
) {
  const getInitialMatch = () => {
    if (globalThis.window === undefined) return false
    const query = getMediaQuery(breakpoint, direction)
    return globalThis.window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState(getInitialMatch)

  useEffect(() => {
    if (globalThis.window === undefined) return
    const query = getMediaQuery(breakpoint, direction)
    const mq = globalThis.window.matchMedia(query)
    setMatches(mq.matches)
    const cb = (ev: MediaQueryListEvent) => setMatches(ev.matches)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }, [breakpoint, direction])

  return matches
}
