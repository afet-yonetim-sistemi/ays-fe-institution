'use client'

import LanguageToggle from '@/components/dashboard/languageToggle'
import { ModeToggle } from '@/components/dashboard/modeToggle'
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
import { PhoneInput } from '@/components/ui/phone-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cityList } from '@/constants/trCity'
import { useToast } from '@/hooks/useToast'
import { handleApiError } from '@/lib/handleApiError'
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
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [institutionName, setInstitutionName] = useState<string>('')
  const router = useRouter()
  const form = useForm<z.infer<typeof InstitutionFormSchema>>({
    resolver: zodResolver(InstitutionFormSchema),
    mode: 'onChange',
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
        toast({
          title: 'success',
          description: 'successRegisterCompleted',
          variant: 'success',
        })
        router.push('/login')
      })
      .catch((error) => {
        handleApiError(error)
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
          <nav className="fixed flex gap-2 right-8 top-4">
            <ModeToggle />
            <LanguageToggle />
          </nav>
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
                  <FormItem>
                    <FormLabel>{t('institution')}</FormLabel>
                    <FormControl>
                      <Input value={institutionName} disabled />
                    </FormControl>
                  </FormItem>
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('firstName')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('firstName')} />
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
                        <FormLabel>{t('lastName')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('lastName')} />
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
                        <FormLabel>{t('emailAddress')}</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder={t('emailAddress')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            onChange={field.onChange}
                            disableCountrySelection
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password')}</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder={t('password')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={'w-full'}
                  >
                    {isLoading ? <LoadingSpinner /> : t('completeRegister')}
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
