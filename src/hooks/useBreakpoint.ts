import { useEffect, useState } from 'react'
import {
  BreakpointDirections as BreakpointDirectionsConst,
  Breakpoint,
} from '@/constants/breakpoint'

export type BreakpointDirection = 'up' | 'down' | 'only'

const getMediaQuery = (
  breakpoint: keyof typeof Breakpoint,
  direction: BreakpointDirection
): string => {
  const px = Breakpoint[breakpoint]
  const keys = Object.keys(Breakpoint)
  const idx = keys.indexOf(breakpoint)
  const nextBp = keys[idx + 1] ? Breakpoint[keys[idx + 1]] : undefined

  const queryMap: Record<BreakpointDirection, string> = {
    down: `(max-width: ${px - 0.1}px)`,
    up: `(min-width: ${px}px)`,
    only: nextBp
      ? `(min-width: ${px}px) and (max-width: ${nextBp - 0.1}px)`
      : `(min-width: ${px}px)`,
  }

  return queryMap[direction]
}

export function useBreakpoint(
  breakpoint: keyof typeof Breakpoint,
  direction: BreakpointDirection = BreakpointDirectionsConst.down
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
