import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { toast } from '@/components/ui/use-toast'
import passwordService from '@/modules/password/service'
import { FormValidationSchema } from '@/modules/login/constants/formValidationSchema'
import { handleApiError } from '@/lib/handleApiError'

interface ForgotPasswordModalProps {
  loginEmail?: string
  disabled?: boolean
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  loginEmail,
  disabled,
}) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>(loginEmail ?? '')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    setEmailError(null)
  }

  const handleSubmit = (): void => {
    const validation = FormValidationSchema.shape.emailAddress.safeParse(email)
    if (!validation.success) {
      setEmailError(t('invalidEmail'))
      return
    }
    setLoading(true)

    passwordService
      .forgotPassword(email)
      .then(() => {
        setIsOpen(false)
        toast({
          title: 'success',
          description: 'resetPasswordEmailSent',
          variant: 'success',
        })
      })
      .catch((error) => {
        handleApiError(error, {
          description: 'error.invalidEmailForgotPassword',
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setEmail(loginEmail ?? '')
  }, [loginEmail])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className={'w-full'} variant="link">
          {t('forgotPassword')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('forgotPassword')}</DialogTitle>
          <DialogDescription>
            {t('forgotPasswordInstruction')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>
        </div>
        <DialogFooter className="justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSubmit}
            disabled={loading || !email}
          >
            {loading ? <LoadingSpinner /> : t('send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordModal
