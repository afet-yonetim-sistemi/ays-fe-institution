import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { StatusProps } from '../constants/types'
import { StatusData } from '../constants/status'

const Status = ({ status }: StatusProps): JSX.Element => {
  const [statusData, setStatusData] = useState<{
    label: string
    color: string
  }>({ label: '', color: '' })
  const { t } = useTranslation()

  const getStatus = (status: string): { color: string; label: string } => {
    const statusItem = StatusData.find((item) => item.value === status)
    const color = statusItem ? statusItem.color : ''
    const label = statusItem ? statusItem.label : ''
    return { color, label }
  }

  useEffect(() => {
    setStatusData(getStatus(status))
  }, [status])

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs',
        statusData?.color
      )}
    >
      {t(`${statusData.label}`)}
    </span>
  )
}

export default Status
