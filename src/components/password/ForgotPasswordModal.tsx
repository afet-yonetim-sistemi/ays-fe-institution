import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { FormValidationSchema } from '@/modules/login/constants/formValidationSchema'
import passwordService from '@/modules/password/service'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const [prevLoginEmail, setPrevLoginEmail] = useState(loginEmail)

  if (loginEmail !== prevLoginEmail) {
    setPrevLoginEmail(loginEmail)
    setEmail(loginEmail ?? '')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    setEmailError(null)
  }

  const handleSubmit = (): void => {
    const validation = FormValidationSchema.shape.emailAddress.safeParse(email)
    if (!validation.success) {
      setEmailError(t('validation.email'))
      return
    }
    setLoading(true)

    passwordService
      .forgotPassword(email)
      .then(() => {
        setIsOpen(false)
        showSuccessToast('password.forgot.success')
      })
      .catch((error) => {
        showErrorToast(error, 'password.forgot.error', { show401: true })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className={'w-full'} variant="link">
          {t('password.forgot.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('password.forgot.title')}</DialogTitle>
          <DialogDescription>
            {t('password.forgot.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email">{t('common.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
          </div>
        </div>
        <DialogFooter className="justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSubmit}
            disabled={loading || !email}
          >
            {loading ? <LoadingSpinner /> : t('common.send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordModal
