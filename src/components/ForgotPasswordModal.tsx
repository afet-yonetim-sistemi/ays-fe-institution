import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import authService from '@/modules/auth/service'
import { toast } from '@/components/ui/use-toast'

const ForgotPasswordModal = ({ loginEmail, disabled }: { loginEmail?: string, disabled?: boolean }) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>(loginEmail || '')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = () => {
    setLoading(true)

    authService.forgotPassword(email!).then(({ data }: any) => {
      console.log(data)
      setIsOpen(false)
      toast({
        title: t('success'),
        description: t('resetPasswordEmailSent'),
        variant: 'default'
      })
    }).catch(() => {
      toast({
        title: t('error'),
        description: t('invalidEmailForgotPassword'),
        variant: 'destructive'
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    setEmail(loginEmail || '')
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
            <Label htmlFor="email">
              {t('email')}
            </Label>
            <Input
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
        </div>
        <DialogFooter className="justify-end">
          <Button type="button" variant="secondary" onClick={handleSubmit} disabled={loading || !email}>
            {loading ? <LoadingSpinner /> : t('send')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordModal