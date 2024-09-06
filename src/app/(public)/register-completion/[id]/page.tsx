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
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Image from 'next/image'
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
  const [loading, setLoading] = useState(false)
  const [instName, setInstName] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  // const router = useRouter()
  // const { id } = router.query

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

  useEffect(() => {
    setLoading(true)
    console.log('working')

    //TODO: add type for response
    const fetchInstitution = (): Promise<void> =>
      getAdminRegistrationApplicationSummary(params.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          if (response?.status == 200) {
            const data = response?.data.response
            setInstName(data.institution.name)
          } else {
            // router.push('/not-found')
          }
        })
        .catch((error) => {
          // router.push('/not-found')
          console.log('error', error)
        })
        .finally(() => {
          setLoading(false)
        })
    fetchInstitution()
  }, [params.id])

  const togglePasswordVisibility = (): void => setShowPassword((prev) => !prev)

  const onSubmit = (values: z.infer<typeof InstitutionFormSchema>): void => {
    setLoading(true)
    postRegistrationApplication(params.id, values)
      .then((res) => {
        const isSuccess = res.data?.isSuccess
        if (isSuccess) {
          form.reset()
          // router.push('/dashboard')
        }
      })
      .catch(() => {
        toast({
          title: t('error'),
          description: t('error'),
          variant: 'destructive',
        })
      })
      .finally(() => setLoading(false))
  }

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
                        <FormLabel
                          className={`${isError ? 'text-destructive' : 'text-white'}`}
                        >
                          {t('phoneNumber')}
                        </FormLabel>
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
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('password')}
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                          </button>
                        </div>
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
