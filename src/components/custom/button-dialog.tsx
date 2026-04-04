'use client'

import { Button } from '@/shadcn/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/ui/dialog'
import { Label } from '@/shadcn/ui/label'
import { Textarea } from '@/shadcn/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn/ui/tooltip'
import { ReactElement, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  className?: string
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
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
  className,
  tooltipText,
}: ButtonDialogProps): ReactElement => {
  const { t } = useTranslation()
  const reasonFieldId = useId()
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
        <Button variant={variant ?? 'default'} className={className}>
          {t(triggerText)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription className="sr-only">
            {t('common.confirmDescription')}
          </DialogDescription>
        </DialogHeader>
        {reason && (
          <>
            <Label htmlFor={reasonFieldId}>
              {label ?? t('application.rejectReason')}
            </Label>
            <Textarea
              minLength={40}
              maxLength={512}
              onChange={(e) => setReasonText(e.target.value.trim())}
              id={reasonFieldId}
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
          {tooltipText ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                <TooltipContent>
                  <p>{t(tooltipText)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              type="button"
              className="w-36"
              onClick={handleConfirmClick}
              disabled={
                (reason && reasonText.length < 40) || reasonText.length > 512
              }
            >
              {confirmText ?? t('common.yes')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ButtonDialog
