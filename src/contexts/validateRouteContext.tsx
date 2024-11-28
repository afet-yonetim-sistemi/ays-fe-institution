import { createContext } from 'react'

export interface ValidateRouteContextType {
  isProtected: boolean
  currentRoute: string | null
  requiredPermission: string | null
  hasPermission: boolean
}

export const ValidateRouteContext = createContext<
  ValidateRouteContextType | undefined
>(undefined)
