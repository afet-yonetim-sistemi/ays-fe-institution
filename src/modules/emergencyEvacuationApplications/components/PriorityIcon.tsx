import { cn } from '@/lib/utils'
import {
  EmergencyEvacuationApplicationPriority,
  getEmergencyEvacuationApplicationPriorityItem,
} from '@/modules/emergencyEvacuationApplications/constants/priorities'
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
}: PriorityIconProps): JSX.Element | null => {
  const { t } = useTranslation()
  const priorityItem = getEmergencyEvacuationApplicationPriorityItem(priority)
  if (!priorityItem) return null

  const Icon = priorityItem.icon
  const label = t(priorityItem.label)

  return (
    <span
      aria-label={!showLabel ? label : undefined}
      className={cn('inline-flex items-center gap-1.5', className)}
    >
      <span
        className={cn(
          'inline-flex h-6 w-6 items-center justify-center rounded-md border bg-background',
          priorityItem.className,
          iconClassName
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      {showLabel && (
        <span
          className={cn(
            'inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs',
            priorityItem.badgeClassName
          )}
        >
          {label}
        </span>
      )}
    </span>
  )
}

export default PriorityIcon
