'use client'

import { Institution } from '@/common/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { PreApplicationFormSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import {
  approveAdminRegistrationApplication,
  getPreApplicationSummary,
} from '@/modules/adminRegistrationApplications/service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [institutionSummary, setInstitutionSummary] = useState<Institution[]>(
    []
  )

  const form = useForm<z.infer<typeof PreApplicationFormSchema>>({
    resolver: zodResolver(PreApplicationFormSchema),
    defaultValues: {
      institutionId: '',
      reason: '',
    },
  })

  const onSubmit = (values: z.infer<typeof PreApplicationFormSchema>): void => {
    setIsLoading(true)
    approveAdminRegistrationApplication(values)
      .then((res) => {
        showSuccessToast('application.admin.preliminary.success')
        router.push(`/admin-registration-applications/${res.data.response.id}`)
      })
      .catch((error) => {
        showErrorToast(error, 'application.admin.preliminary.error')
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    getPreApplicationSummary()
      .then((response) => {
        const summaryData = response.data.response
        setInstitutionSummary(summaryData)
      })
      .catch((error) => {
        showErrorToast(error)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {t('application.admin.preliminary.title')}
            </h1>
            <Button disabled={isLoading} type="submit" className={'min-w-20'}>
              {isLoading ? <LoadingSpinner /> : t('common.create')}
            </Button>
          </div>
          <Card className="p-6 w-full">
            <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-6">
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>{t('common.institution')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'application.admin.preliminary.selectInstitution'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {institutionSummary?.map((item: Institution) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {t('application.admin.preliminary.reason')}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        </div>
      </form>
    </Form>
  )
}

export default Page
