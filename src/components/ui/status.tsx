import React from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { StatusData } from '@/constants/statusData'

const Status = ({ status }: { status: string }): JSX.Element => {
  const { t } = useTranslation()

  const getColorClass = (status: string): string => {
    const statusItem = StatusData.find((item) => item.value === status)
    return statusItem ? statusItem.color : ''
  }

  const getTranslationKey = (status: string): string => {
    const statusItem = StatusData.find((item) => item.value === status)
    return statusItem ? statusItem.label : ''
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs',
        getColorClass(status)
      )}
    >
      {t(getTranslationKey(status))}
    </span>
  )
}

export default Status