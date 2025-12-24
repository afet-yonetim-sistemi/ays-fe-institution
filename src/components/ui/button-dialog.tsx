'use client'

import { DialogDescription } from '@radix-ui/react-dialog'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Label } from './label'
import { Textarea } from './textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

interface ButtonDialogProps {
  triggerText: string
  title: string
  confirmText?: string
  cancelText?: string
  tooltipText?: string
  onConfirm: (reason?: string) => object | void
  onCancel?: () => void
  reason?: boolean
  label?: string
  variant:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'success'
    | null
    | undefined
}

const ButtonDialog = ({
  triggerText,
  title,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  reason = false,
  label,
  variant,
  tooltipText,
}: ButtonDialogProps): ReactElement => {
  const { t } = useTranslation()
  const [reasonText, setReasonText] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleConfirmClick = (): void => {
    onConfirm(reason ? reasonText : undefined)
    setIsOpen(false)
  }

  const handleCancelClick = (): void => {
    if (onCancel) {
      onCancel()
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant ?? 'default'}>{t(triggerText)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {reason && (
          <>
            <Label htmlFor={'reason'}>
              {label ?? t('application.rejectReason')}
            </Label>
            <Textarea
              minLength={40}
              maxLength={512}
              onChange={(e) => setReasonText(e.target.value.trim())}
              id="reason"
            />
          </>
        )}
        <div className="mt-4 flex justify-center space-x-5">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-36"
              onClick={handleCancelClick}
            >
              {cancelText ?? t('common.no')}
            </Button>
          </DialogClose>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  type="button"
                  className="w-36"
                  onClick={handleConfirmClick}
                  disabled={
                    (reason && reasonText.length < 40) ||
                    reasonText.length > 512
                  }
                >
                  {confirmText ?? t('common.yes')}
                </Button>
              </TooltipTrigger>
              {tooltipText && (
                <TooltipContent>
                  <p>{t(tooltipText)}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ButtonDialog }
