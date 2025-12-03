'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { PasswordInput } from '@/components/ui/passwordInput'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { FormValidationSchema } from '@/modules/password/constants/formValidationSchema'
import passwordService from '@/modules/password/service'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import LanguageToggle from '../dashboard/languageToggle'
import { ModeToggle } from '../dashboard/modeToggle'

const CreatePasswordCard: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const passwordForm = useForm<z.infer<typeof FormValidationSchema>>({
    resolver: zodResolver(FormValidationSchema),
    defaultValues: {
      password: '',
      passwordRepeat: '',
    },
  })

  const onSubmit = (values: z.infer<typeof FormValidationSchema>): void => {
    setLoading(true)
    passwordService
      .resetPassword(values, id)
      .then(() => {
        showSuccessToast('password.create.success')
      })
      .catch((error) => {
        showErrorToast(error, 'password.create.error')
      })
      .finally(() => {
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      })
  }

  return (
    <div className={'container'}>
      <nav className="fixed right-8 top-4 flex gap-2">
        <ModeToggle />
        <LanguageToggle />
      </nav>
      <Card className={'h-fit min-h-[558px] w-[410px]'}>
        <CardHeader className={'flex items-center'}>
          <Image
            src={'/aysfavicon360.png'}
            alt={'AYS'}
            width={100}
            height={100}
          />
          <CardTitle>{t('password.create.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('password.create.description')}
          </CardDescription>
        </CardHeader>
        <CardHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={passwordForm.control}
                name="password"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.password')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('common.password')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="passwordRepeat"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password.create.repeat')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('password.create.repeat')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className={'w-full'}>
                {loading ? <LoadingSpinner /> : t('password.create.button')}
              </Button>
            </form>
          </Form>
        </CardHeader>
      </Card>
    </div>
  )
}

export default CreatePasswordCard
