export const LoadingType = {
  SPINNER: 'spinner',
  SKELETON: 'skeleton',
} as const

export type LoadingTypeValue = (typeof LoadingType)[keyof typeof LoadingType]
