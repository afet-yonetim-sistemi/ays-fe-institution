export enum BreakpointSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
}

export const Breakpoint: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const BreakpointDirections = {
  up: 'up',
  down: 'down',
  only: 'only',
} as const
