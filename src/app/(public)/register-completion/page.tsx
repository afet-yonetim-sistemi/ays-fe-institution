'use client'

import { getRegistrationApplication } from '@/api/controller/instutionController'
import { PhoneInput } from '@/components/phoneInput'
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
import { cityList } from '@/constants/trCity'
import { FormSchema } from '@/modules/adminRegistrationApplications/constants/formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const RegisterCompletion = () => {
  const [loading, setLoading] = useState(false)
  const [instName, setInstName] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev)
  const router = useRouter()
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: {
        countryCode: '',
        lineNumber: '',
      },
      city: '',
      password: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response: any = await getRegistrationApplication(
          '04930b1d-efab-45d5-a31d-077c4f30125f',
        )

        if (response?.status == 200) {
          const data = response?.data.response
          setInstName(data.institution.name)
        } else {
          router.push('/not-found')
        }
      } catch (error) {
        console.log('Error fetching registration application:', error)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log('Values:', values)

    // await postRegistrationApplication(
    //   '04930b1d-efab-45d5-a31d-077c4f30125f',
    //   values,
    // )
  }

  return (
    <div className="container mt-[200px]">
      {(loading && <LoadingSpinner />) || (
        <Card className="w-[410px] h-fit">
          <CardHeader className="flex items-center">
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phoneNumber')}</FormLabel>
                      <FormControl>
                        <PhoneInput onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                              {' '}
                              {city}{' '}
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

export default RegisterCompletion
