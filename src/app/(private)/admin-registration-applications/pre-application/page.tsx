'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import Title from '@/components/ui/title'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import {
  approveAdminRegistrationApplication,
  getPreApplicationSummary,
} from '@/modules/adminRegistrationApplications/service'
import { useToast } from '@/components/ui/use-toast'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { PreApplicationFormSchema } from '@/modules/adminRegistrationApplications/constants/formValidationSchema'
import { Institution } from '@/common/types'
import { handleApiError } from '@/lib/handleApiError'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const { toast } = useToast()
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
        toast({
          title: t('success'),
          description: t('preApplicationSuccess'),
          variant: 'success',
        })
        router.push(`/admin-registration-applications/${res.data.response.id}`)
      })
      .catch((error) => {
        handleApiError(error, { description: t('error.preApplication') })
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
        handleApiError(error)
      })
      .finally(() => setIsLoading(false))
  }, [t])

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md text-black dark:text-white">
      <Title title={t('preApplicationTitle')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="p-6 w-full">
            <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-6">
              <FormField
                control={form.control}
                name="institutionId"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>{t('institution')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectInstitution')} />
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
                    <FormLabel>{t('createReason')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
          <Button disabled={isLoading} type="submit" className={'min-w-20'}>
            {isLoading ? <LoadingSpinner /> : t('common.create')}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Page
