'use client'

import CitySelect from '@/components/CitySelect'
import LanguageToggle from '@/components/dashboard/languageToggle'
import { ModeToggle } from '@/components/dashboard/modeToggle'
import PhoneNumberField from '@/components/PhoneNumberField'
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
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { InstitutionFormSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import {
  getAdminRegistrationApplicationSummary,
  postRegistrationApplication,
} from '@/modules/adminRegistrationApplications/service'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const Page = ({
  params,
}: {
  params: { slug: string; id: string }
}): JSX.Element => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [institutionName, setInstitutionName] = useState<string>('')
  const router = useRouter()
  const form = useForm<z.infer<typeof InstitutionFormSchema>>({
    resolver: zodResolver(InstitutionFormSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: { countryCode: '90', lineNumber: '' },
    },
  })

  const { control } = form

  useEffect(() => {
    getAdminRegistrationApplicationSummary(params.id)
      .then((response) => {
        const data = response?.data.response
        setInstitutionName(data.institution.name)
      })
      .catch(() => {
        router.replace('/not-found')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [params.id, router])

  const onSubmit = (values: z.infer<typeof InstitutionFormSchema>): void => {
    setIsLoading(true)
    postRegistrationApplication(params.id, values)
      .then(() => {
        showSuccessToast('application.admin.completion.success')
        router.push('/login')
      })
      .catch((error) => {
        showErrorToast(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="container mt-[140px]">
      {isLoading && <LoadingSpinner />}
      {!isLoading && institutionName && (
        <>
          <nav className="fixed right-8 top-4 flex gap-2">
            <ModeToggle />
            <LanguageToggle />
          </nav>
          <Card className="h-fit min-h-[558px] w-[410px]">
            <CardHeader className="flex items-center gap-2">
              <Image
                src={'/aysfavicon360.png'}
                alt="AYS"
                width={100}
                height={100}
              />
              <CardTitle> {t('common.welcome')} </CardTitle>
              <CardDescription className="text-center">
                {t('application.admin.completion.description')}
              </CardDescription>
            </CardHeader>
            <CardHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormItem>
                    <FormLabel>{t('common.institution')}</FormLabel>
                    <FormControl>
                      <Input value={institutionName} disabled />
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.firstName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('common.firstName')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.lastName')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('common.lastName')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.email')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('common.email')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <PhoneNumberField control={control} />

                  <CitySelect control={control} />

                  <FormField
                    control={form.control}
                    name="password"
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
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      t('application.admin.completion.button')
                    )}
                  </Button>
                </form>
              </Form>
            </CardHeader>
          </Card>
        </>
      )}
    </div>
  )
}

Page.getLayout = (page: React.ReactNode) => page

export default Page
