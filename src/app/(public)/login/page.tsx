'use client'

import { useState } from 'react'
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
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/passwordInput'
import { useAppDispatch } from '@/store/hooks'
import authService from '@/modules/auth/service'
import { loginFailed, loginSuccess } from '@/modules/auth/authSlice'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'

const Page = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    username: z
      .string()
      .min(1, t('requiredField'))
      .min(2, t('minLength', { field: 2 }))
      .max(50, t('maxLength', { field: 50 })),
    password: z
      .string()
      .min(1, t('requiredField'))
      .min(8, t('minLength', { field: 8 }))
      .max(50, t('maxLength', { field: 50 })),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return loading ? (
    <div className={'spinner'}>
      <LoadingSpinner size={100} />
    </div>
  ) : (
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('username')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
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
              <Button type="submit" className={'w-full'}>
                {t('submit')}
              </Button>
            </form>
          </Form>
        </CardHeader>
      </Card>
    </div>
  )
}

export default Page
