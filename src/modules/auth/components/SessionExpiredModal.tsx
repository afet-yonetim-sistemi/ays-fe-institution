'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SessionExpiredModalProps {
  countdown: number
  title?: string
  description?: string
}

const SessionExpiredModal = ({
  countdown,
  title,
  description,
}: SessionExpiredModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [localCountdown, setLocalCountdown] = useState(countdown)

  useEffect(() => {
    setLocalCountdown(countdown)
  }, [countdown])

  useEffect(() => {
    if (localCountdown > 0) {
      const timer = setInterval(() => {
        setLocalCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [localCountdown])

  return (
    <Dialog open={true} onOpenChange={() => false}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {title || t('sessionExpired.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600 mt-2">
            {description || t('sessionExpired.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            {t('sessionExpired.countdown', { seconds: localCountdown })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SessionExpiredModal
