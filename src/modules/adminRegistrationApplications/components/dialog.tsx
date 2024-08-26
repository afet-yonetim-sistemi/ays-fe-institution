'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogDescription } from '@radix-ui/react-dialog'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  variant?:
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

  const handleConfirmClick = (): void => {
    onConfirm(reason ? reasonText : undefined)
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant || 'default'}>{t(triggerText)}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {reason && (
          <>
            <Label htmlFor={'reason'}>{label || t('rejectReason')}</Label>
            <Textarea
              minLength={40}
              maxLength={512}
              onChange={(e) => setReasonText(e.target.value.trim())}
              id="reason"
            />
          </>
        )}
        <div className="flex justify-center space-x-5 mt-4">
          <DialogClose>
            <Button
              type="button"
              variant="outline"
              className="w-36"
              onClick={onCancel}
            >
              {cancelText || t('no')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
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
                    {confirmText || t('yes')}
                  </Button>
                </TooltipTrigger>
                {tooltipText && (
                  <TooltipContent>
                    <p>{t(tooltipText)}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ButtonDialog
