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
import React, { useEffect, useState } from 'react'
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
  const [isLoading, setIsLoading] = useState(true)
  const [institutionName, setInstitutionName] = useState<string>('')
  const router = useRouter()
  const form = useForm<z.infer<typeof InstitutionFormSchema>>({
    resolver: zodResolver(InstitutionFormSchema),
    mode: 'onChange',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { control, reset, formState } = form

  useEffect(() => {
    getAdminRegistrationApplicationSummary(params.id)
      .then((response) => {
        const data = response?.data.response
        setInstitutionName(data.institution.name)
      })
      .catch((error) => {
        router.push('/not-found')
        handleApiError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [params.id, router])

  const onSubmit = (values: z.infer<typeof InstitutionFormSchema>): void => {
    setIsLoading(true)
    postRegistrationApplication(params.id, values)
      .then(() => {
        toast({
          title: t('success'),
          description: t('successRegisterCompleted'),
          variant: 'success',
        })
        router.push('/login')
        form.reset()
      })
      .catch((error) => {
        handleApiError(error)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="container mt-[140px]">
      {isLoading && <LoadingSpinner />}
      {!isLoading && institutionName && (
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={control}
                  name="institutionName"
                  disabled
                  render={() => (
                    <FormItem>
                      <FormLabel>{t('institution')}</FormLabel>
                      <FormControl>
                        <Input disabled value={institutionName} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="firstName"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('firstName')}</FormLabel>
                      <FormControl>
                        <>
                          <Input {...field} placeholder={t('firstName')} />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  disabled={isLoading}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('lastName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('lastName')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailAddress"
                  disabled={isLoading}
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
                {/*<FormField*/}
                {/*  control={form.control}*/}
                {/*  name="phoneNumber"*/}
                {/*  disabled={isLoading}*/}
                {/*  render={({ field, fieldState }) => {*/}
                {/*    const isError =*/}
                {/*      (!field.value.countryCode || !field.value.lineNumber) &&*/}
                {/*      fieldState.error*/}
                {/*    return (*/}
                {/*      <FormItem>*/}
                {/*        <FormLabel>{t('phoneNumber')}</FormLabel>*/}
                {/*        <FormControl>*/}
                {/*          <PhoneInput onChange={field.onChange} />*/}
                {/*        </FormControl>*/}
                {/*        <div className="text-sm font-medium text-destructive">*/}
                {/*          {isError && <div>{t('requiredField')}</div>}*/}
                {/*        </div>*/}
                {/*      </FormItem>*/}
                {/*    )*/}
                {/*  }}*/}
                {/*/>*/}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.city')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('common.city')} />
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
                  disabled={isLoading}
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
                <Button type="submit" disabled={isLoading} className={'w-full'}>
                  {isLoading ? <LoadingSpinner /> : t('completeRegister')}
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
