import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  LucideIcon,
  Minus,
} from 'lucide-react'

export type EmergencyEvacuationApplicationPriority =
  | 'CRITICAL'
  | 'HIGHEST'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'LOWEST'

export interface EmergencyEvacuationApplicationPriorityItem {
  label: string
  value: EmergencyEvacuationApplicationPriority
  icon: LucideIcon
  className: string
  badgeClassName: string
}

export const emergencyEvacuationApplicationPriorities: EmergencyEvacuationApplicationPriorityItem[] =
  [
    {
      label: 'priority.critical',
      value: 'CRITICAL',
      icon: AlertTriangle,
      className: 'border-red-300 text-red-600',
      badgeClassName: 'bg-red-600 text-white',
    },
    {
      label: 'priority.highest',
      value: 'HIGHEST',
      icon: ChevronsUp,
      className: 'border-red-300 text-red-500',
      badgeClassName: 'bg-red-500 text-white',
    },
    {
      label: 'priority.high',
      value: 'HIGH',
      icon: ChevronUp,
      className: 'border-orange-300 text-orange-500',
      badgeClassName: 'bg-orange-500 text-white',
    },
    {
      label: 'priority.medium',
      value: 'MEDIUM',
      icon: Minus,
      className: 'border-amber-300 text-amber-500',
      badgeClassName: 'bg-amber-500 text-white',
    },
    {
      label: 'priority.low',
      value: 'LOW',
      icon: ChevronDown,
      className: 'border-blue-300 text-blue-500',
      badgeClassName: 'bg-blue-500 text-white',
    },
    {
      label: 'priority.lowest',
      value: 'LOWEST',
      icon: ChevronsDown,
      className: 'border-blue-300 text-blue-600',
      badgeClassName: 'bg-blue-600 text-white',
    },
  ]

export const getEmergencyEvacuationApplicationPriorityItem = (
  priority: EmergencyEvacuationApplicationPriority
): EmergencyEvacuationApplicationPriorityItem | undefined => {
  return emergencyEvacuationApplicationPriorities.find(
    (item) => item.value === priority
  )
}
