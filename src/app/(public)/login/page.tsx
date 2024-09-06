'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle
} from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/passwordInput'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import authService from '@/modules/auth/service'
import {
  loginFailed,
  loginSuccess,
  selectToken
} from '@/modules/auth/authSlice'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { useToast } from '@/components/ui/use-toast'
import ForgotPasswordModal from '@/components/password/ForgotPasswordModal'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const tokenInfo = useAppSelector(selectToken)

  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    emailAddress: z
      .string()
      .min(1, t('requiredField'))
      .email(t('invalidEmail')),
    password: z
      .string()
      .min(1, t('requiredField'))
      .min(6, t('minLength', { field: 6 }))
      .max(50, t('maxLength', { field: 50 })),
    sourcePage: z.string()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
      sourcePage: 'INSTITUTION'
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>): void => {
    setLoading(true)
    authService
      .login(values)
      .then((res) => {
        dispatch(loginSuccess(res.data.response))
        form.reset()
        router.push('/dashboard')
      })
      .catch((err) => {
        dispatch(loginFailed(err.message))
        form.setValue('password', '')
        toast({
          title: t('error'),
          description: t('invalidEmailAndPassword'),
          variant: 'destructive'
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (tokenInfo) {
      router.push('/dashboard')
    }
  }, [tokenInfo, router])

  if (tokenInfo) return

  return (
    <div className={'container'}>
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
              <ForgotPasswordModal disabled={loading} loginEmail={form.watch('emailAddress')} />
            </form>
          </Form>
        </CardHeader>
      </Card>
    </div>
  )
}

export default Page
