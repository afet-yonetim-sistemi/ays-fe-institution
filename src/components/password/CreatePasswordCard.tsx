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
import { useToast } from '@/components/ui/use-toast'
import { handleApiError } from '@/lib/handleApiError'
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
  const { toast } = useToast()
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
        toast({
          title: t('success'),
          description: t('passwordSuccess'),
          variant: 'success',
        })
      })
      .catch((error) => {
        handleApiError(error, {
          description: t('error.passwordRequestInvalidOrExpired'),
        })
      })
      .finally(() => {
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      })
  }

  return (
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
          <CardTitle>{t('passwordTitle')}</CardTitle>
          <CardDescription>{t('passwordDescription')}</CardDescription>
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
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder={t('password')} {...field} />
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
                    <FormLabel>{t('passwordRepeat')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t('passwordRepeat')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className={'w-full'}>
                {loading ? <LoadingSpinner /> : t('createPassword')}
              </Button>
            </form>
          </Form>
        </CardHeader>
      </Card>
    </div>
  )
}

export default CreatePasswordCard
