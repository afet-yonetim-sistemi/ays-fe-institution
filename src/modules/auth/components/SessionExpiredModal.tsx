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
import { Button } from '@/components/ui/button'

interface SessionExpiredModalProps {
  title?: string
  description?: string
  initialCountdown?: number
  onLogout: () => void
}

const SessionExpiredModal = ({
  title,
  description,
  initialCountdown = 3,
  onLogout,
}: SessionExpiredModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState(initialCountdown)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            onLogout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [countdown, onLogout])

  return (
    <Dialog open={true} onOpenChange={() => false}>
      <DialogContent
        className="sm:max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {title ?? t('sessionExpired.title')}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600 mt-2">
            {description ?? t('sessionExpired.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            {t('sessionExpired.countdown', { seconds: countdown })}
          </p>
        </div>
        <div className="flex justify-center pb-2">
          <Button onClick={onLogout} className="w-full">
            {t('sessionExpired.loginAgain')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SessionExpiredModal
