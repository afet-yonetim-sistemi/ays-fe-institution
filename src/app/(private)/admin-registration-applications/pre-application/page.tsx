'use client'

import { Institution } from '@/common/types'
import { LoadingSpinner } from '@/components/custom/loadingSpinner'
import { Button } from '@/shadcn/ui/button'
import { Card } from '@/shadcn/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select'
import { Textarea } from '@/shadcn/ui/textarea'
import { useCreatePage } from '@/hooks/useCreatePage'
import { showErrorToast } from '@/lib/showToast'
import { adminRegistrationApplicationFormConfig } from '@/modules/adminRegistrationApplications/constants/formConfig'
import {
  createAdminRegistrationApplication,
  getPreApplicationSummary,
} from '@/modules/adminRegistrationApplications/service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const Page = (): React.ReactNode => {
  const { t } = useTranslation()
  const { handleCreate, isCreating } = useCreatePage({
    createItem: createAdminRegistrationApplication,
    redirectPath: '/admin-registration-applications',
    successMessage: 'application.admin.preliminary.success',
    errorMessage: 'application.admin.preliminary.error',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [institutionSummary, setInstitutionSummary] = useState<Institution[]>(
    []
  )

  const form = useForm<
    z.infer<
      typeof adminRegistrationApplicationFormConfig.preApplicationValidationSchema
    >
  >({
    resolver: zodResolver(
      adminRegistrationApplicationFormConfig.preApplicationValidationSchema
    ),
    defaultValues:
      adminRegistrationApplicationFormConfig.getPreApplicationDefaultValues(),
  })

  const onSubmit = (
    values: z.infer<
      typeof adminRegistrationApplicationFormConfig.preApplicationValidationSchema
    >
  ): void => {
    handleCreate(values)
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
        <div className="rounded-md bg-white p-6 text-black shadow-md dark:bg-gray-800 dark:text-white">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              {t('application.admin.preliminary.title')}
            </h1>
            <Button
              disabled={isLoading || isCreating}
              type="submit"
              className={'min-w-20'}
            >
              {isCreating ? <LoadingSpinner /> : t('common.create')}
            </Button>
          </div>
          <Card className="w-full p-6">
            <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-6">
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>
                      {t(
                        adminRegistrationApplicationFormConfig.fields
                          .institutionId.label
                      )}
                    </FormLabel>
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
                      {t(
                        adminRegistrationApplicationFormConfig.fields.reason
                          .label
                      )}
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
