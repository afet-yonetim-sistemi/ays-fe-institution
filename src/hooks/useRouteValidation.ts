import {
  ValidateRouteContext,
  ValidateRouteContextType,
} from '@/contexts/validateRouteContext'
import { useContext } from 'react'

export const useRouteValidation = (): ValidateRouteContextType => {
  const context = useContext(ValidateRouteContext)
  if (!context) {
    throw new Error('useRouteValidation must be used within a RouteProvider')
  }
  return context
}
