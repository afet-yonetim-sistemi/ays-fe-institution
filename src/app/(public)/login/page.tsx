'use client'

import LanguageToggle from '@/components/dashboard/languageToggle'
import { ModeToggle } from '@/components/dashboard/modeToggle'
import ForgotPasswordModal from '@/components/password/ForgotPasswordModal'
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
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { PasswordInput } from '@/components/ui/passwordInput'
import { Toaster } from '@/components/ui/toaster'
import { handleApiError } from '@/lib/handleApiError'
import {
  loginFailed,
  loginSuccess,
  selectError,
} from '@/modules/auth/authSlice'
import authService from '@/modules/auth/service'
import { FormValidationSchema } from '@/modules/login/constants/formValidationSchema'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const error = useAppSelector(selectError)

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormValidationSchema>>({
    resolver: zodResolver(FormValidationSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
      sourcePage: 'INSTITUTION',
    },
  })

  const onSubmit = (values: z.infer<typeof FormValidationSchema>): void => {
    setLoading(true)
    authService
      .login(values)
      .then((res) => {
        dispatch(loginSuccess(res.data.response))
        router.push('/dashboard')
      })
      .catch((error) => {
        dispatch(loginFailed(error.message))
        form.setValue('password', '')
        handleApiError(error, {
          description: t('error.invalidEmailOrPassword'),
        })
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      {error && <Toaster />}
      <div className={'container'}>
        <nav className="fixed flex gap-2 right-8 top-4">
          <ModeToggle />
          <LanguageToggle />
        </nav>
        <Card className={'w-[410px] h-fit'}>
          <CardHeader className={'flex items-center'}>
            <Image
              src={'/aysfavicon360.png'}
              alt={'AYS'}
              width={100}
              height={100}
            />
            <CardTitle>{t('welcome')}</CardTitle>
            <CardDescription>{t('loginDescription')}</CardDescription>
          </CardHeader>
          <CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="emailAddress"
                  disabled={loading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('email')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  disabled={loading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder={t('password')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className={'w-full'}>
                  {loading ? <LoadingSpinner /> : t('login')}
                </Button>
                <ForgotPasswordModal
                  disabled={loading}
                  loginEmail={form.watch('emailAddress')}
                />
              </form>
            </Form>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}

export default Page
