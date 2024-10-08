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
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { PhoneInput } from '@/components/ui/phoneInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { cityList } from '@/constants/trCity'
import { InstitutionFormSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import {
  getAdminRegistrationApplicationSummary,
  postRegistrationApplication,
} from '@/modules/adminRegistrationApplications/service'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { PasswordInput } from '@/components/ui/passwordInput'
import { handleApiError } from '@/lib/handleApiError'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [instName, setInstName] = useState<string>('')
  const router = useRouter()

  const form = useForm<z.infer<typeof InstitutionFormSchema>>({
    resolver: zodResolver(InstitutionFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      city: '',
      password: '',
      phoneNumber: {
        countryCode: '',
        lineNumber: '',
      },
    },
  })

  const onSubmit = (values: z.infer<typeof InstitutionFormSchema>): void => {
    setLoading(true)
    postRegistrationApplication(params.id, values)
      .then(() => {
        toast({
          title: t('success'),
          description: t('successRegisterCompleted'),
          variant: 'success',
        })
        form.reset()
        router.push('/login')
      })
      .catch((error) => {
        handleApiError(error)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getAdminRegistrationApplicationSummary(params.id)
      .then((response) => {
        const data = response?.data.response
        setInstName(data.institution.name)
      })
      .catch((error) => {
        router.push('/not-found')
        handleApiError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [params.id, router])

  return (
    <div className="container mt-[140px]">
      {(loading && <LoadingSpinner />) || (
        <Card className="w-[410px] h-fit">
          <CardHeader className="flex items-center gap-2">
            <Image
              src={'/aysfavicon360.png'}
              alt="AYS"
              width={100}
              height={100}
            />
            <CardTitle> {t('welcome')} </CardTitle>
            <CardDescription className="text-center">
              {t('adminRegistrationDescription')}
            </CardDescription>
          </CardHeader>
          <CardHeader>
            <div>
              <label> {t('institution')} </label>
              <Input disabled placeholder={t('institution')} value={instName} />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  disabled={loading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('firstname')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('firstname')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  disabled={loading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('lastname')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('lastname')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="phoneNumber"
                  disabled={loading}
                  render={({ field, fieldState }) => {
                    const isError =
                      (!field.value.countryCode || !field.value.lineNumber) &&
                      fieldState.error
                    return (
                      <FormItem>
                        <FormLabel>{t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <PhoneInput onChange={field.onChange} />
                        </FormControl>
                        <div className="text-sm font-medium text-destructive">
                          {isError && <div>{t('requiredField')}</div>}
                        </div>
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('city')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('city')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cityList.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  {loading ? <LoadingSpinner /> : t('register')}
                </Button>
              </form>
            </Form>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

export default Page
