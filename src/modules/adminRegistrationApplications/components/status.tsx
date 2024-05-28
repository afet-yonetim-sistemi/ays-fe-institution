import React from 'react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

const Status = ({ status }: { status: string }) => {
  const { t } = useTranslation()
  return (
    <span
      className={clsx('inline-flex items-center rounded-md px-2 py-1 text-xs', {
        'bg-red-500 text-white': status === 'REJECTED',
        'bg-green-500 text-white': status === 'COMPLETED',
        'bg-yellow-500 text-white': status === 'WAITING',
        'bg-sky-500 text-white': status === 'VERIFIED',
      })}
    >
      {t(`${status.toLowerCase()}`)}
    </span>
  )
}

export default Status
