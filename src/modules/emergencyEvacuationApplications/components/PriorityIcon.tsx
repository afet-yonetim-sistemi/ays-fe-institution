import { cn } from '@/lib/utils'
import {
  EMERGENCY_EVACUATION_APPLICATION_PRIORITIES,
  EmergencyEvacuationApplicationPriority,
} from '@/modules/emergencyEvacuationApplications/constants/priorities'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PriorityIconProps {
  priority: EmergencyEvacuationApplicationPriority
  className?: string
  iconClassName?: string
  showLabel?: boolean
}

const PriorityIcon = ({
  priority,
  className,
  iconClassName,
  showLabel = true,
}: PriorityIconProps): React.ReactNode | null => {
  const { t } = useTranslation()
  const priorityItem = EMERGENCY_EVACUATION_APPLICATION_PRIORITIES[priority]
  if (!priorityItem) return null

  const Icon = priorityItem.icon
  const label = t(priorityItem.label)

  return (
    <span
      aria-label={!showLabel ? label : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1',
        priorityItem.badgeClassName,
        className
      )}
    >
      <Icon className={cn('h-3.5 w-3.5', iconClassName)} />
      {showLabel && (
        <span className="text-xs font-medium whitespace-nowrap">{label}</span>
      )}
    </span>
  )
}

export default PriorityIcon
