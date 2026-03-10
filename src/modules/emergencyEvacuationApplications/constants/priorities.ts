import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  LucideIcon,
  Minus,
} from 'lucide-react'

export const EmergencyEvacuationApplicationPriority = {
  CRITICAL: 'CRITICAL',
  HIGHEST: 'HIGHEST',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  LOWEST: 'LOWEST',
} as const

export type EmergencyEvacuationApplicationPriority =
  (typeof EmergencyEvacuationApplicationPriority)[keyof typeof EmergencyEvacuationApplicationPriority]

export interface EmergencyEvacuationApplicationPriorityItem {
  label: string
  value: EmergencyEvacuationApplicationPriority
  icon: LucideIcon
  className: string
  badgeClassName: string
}

export const EMERGENCY_EVACUATION_APPLICATION_PRIORITIES: Record<
  EmergencyEvacuationApplicationPriority,
  EmergencyEvacuationApplicationPriorityItem
> = {
  [EmergencyEvacuationApplicationPriority.CRITICAL]: {
    label: 'priority.critical',
    value: EmergencyEvacuationApplicationPriority.CRITICAL,
    icon: AlertTriangle,
    className: 'border-red-300 text-red-600',
    badgeClassName: 'bg-red-600 text-white',
  },
  [EmergencyEvacuationApplicationPriority.HIGHEST]: {
    label: 'priority.highest',
    value: EmergencyEvacuationApplicationPriority.HIGHEST,
    icon: ChevronsUp,
    className: 'border-red-300 text-red-500',
    badgeClassName: 'bg-red-500 text-white',
  },
  [EmergencyEvacuationApplicationPriority.HIGH]: {
    label: 'priority.high',
    value: EmergencyEvacuationApplicationPriority.HIGH,
    icon: ChevronUp,
    className: 'border-orange-300 text-orange-500',
    badgeClassName: 'bg-orange-500 text-white',
  },
  [EmergencyEvacuationApplicationPriority.MEDIUM]: {
    label: 'priority.medium',
    value: EmergencyEvacuationApplicationPriority.MEDIUM,
    icon: Minus,
    className: 'border-amber-300 text-amber-500',
    badgeClassName: 'bg-amber-500 text-white',
  },
  [EmergencyEvacuationApplicationPriority.LOW]: {
    label: 'priority.low',
    value: EmergencyEvacuationApplicationPriority.LOW,
    icon: ChevronDown,
    className: 'border-blue-300 text-blue-500',
    badgeClassName: 'bg-blue-500 text-white',
  },
  [EmergencyEvacuationApplicationPriority.LOWEST]: {
    label: 'priority.lowest',
    value: EmergencyEvacuationApplicationPriority.LOWEST,
    icon: ChevronsDown,
    className: 'border-blue-300 text-blue-600',
    badgeClassName: 'bg-blue-600 text-white',
  },
} as const
