import { useContext } from 'react'
import {
  ValidateRouteContext,
  ValidateRouteContextType,
} from '@/contexts/validateRouteContext'

export const useRouteValidation = (): ValidateRouteContextType => {
  const context = useContext(ValidateRouteContext)
  if (!context) {
    throw new Error('useRouteValidation must be used within a RouteProvider')
  }
  return context
}
