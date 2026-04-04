import { useSyncExternalStore, useMemo } from 'react'
import {
  Breakpoint,
  BreakpointDirections as BreakpointDirectionsConst,
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
  const query = useMemo(
    () => getMediaQuery(breakpoint, direction),
    [breakpoint, direction]
  )

  const subscribe = (callback: () => void) => {
    if (globalThis.window === undefined) return () => {}
    const mq = globalThis.window.matchMedia(query)
    mq.addEventListener('change', callback)
    return () => mq.removeEventListener('change', callback)
  }

  const getSnapshot = () => {
    if (globalThis.window === undefined) return false
    return globalThis.window.matchMedia(query).matches
  }

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
