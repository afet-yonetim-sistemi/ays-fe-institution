import React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { StatusData } from '../constants/status'
import { StatusProps } from '@/modules/emergencyEvacuationApplications/constants/types'

const Status = ({ status }: StatusProps) => {
  const { t } = useTranslation()
  const getColorClass = (status: string) => {
    const statusItem = StatusData.find((item) => item.value === status)
    return statusItem ? statusItem.color : ''
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs',
        getColorClass(status),
      )}
    >
      {t(`${status.toLowerCase()}`)}
    </span>
  )
}

export default Status
