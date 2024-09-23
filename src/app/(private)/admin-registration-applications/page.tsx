'use client'

import { useEffect, useState } from 'react'
import { postAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { useTranslation } from 'react-i18next'
import { pageSize } from '@/constants/common'
import { columns } from '@/modules/adminRegistrationApplications/components/columns'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDataTable } from '@/app/hocs/useDataTable'
import * as z from 'zod'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import filterFields from '@/modules/adminRegistrationApplications/constants/filterFields'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'

interface AdminRegistrationState {
  content: []
  totalPageCount: number
}

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(pageSize),
  sort: z.string().optional(),
  status: z.string().optional(),
})

const Page = (): JSX.Element => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  )

  const { t } = useTranslation()
  const { toast } = useToast()
  const userPermissions = useAppSelector(selectPermissions)
  const router = useRouter()
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({
      content: [],
      totalPageCount: 0,
    })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    postAdminRegistrationApplications({
      page: search.page,
      per_page: search.per_page,
      sort: search.sort,
      status: search.status,
    })
      .then((responseData) => {
        setAdminRegistration(responseData.data.response)
      })
      .catch((error) => {
        setError(error.message)
        toast({
          title: t('error'),
          description: t('defaultError'),
          variant: 'destructive',
        })
      })
      .finally(() => setIsLoading(false))
  }, [search.page, search.per_page, search.sort, search.status, t, toast])

  const { table } = useDataTable({
    data: adminRegistration.content,
    columns,
    pageCount: adminRegistration.totalPageCount,
    filterFields,
  })

  const handlePreApplicationClick = (): void => {
    router.push('/admin-registration-applications/pre-application')
  }

  return (
    <div className="space-y-1">
      {error && <Toaster />}
      <DataTable table={table} loading={isLoading} enableRowClick>
        <div className="flex items-center justify-between w-full gap-4">
          <h1 className="text-2xl font-medium">
            {t('adminRegistrationApplications.title')}
          </h1>
          {userPermissions.includes(Permission.APPLICATION_CREATE) && (
            <Button onClick={handlePreApplicationClick}>
              {t('preApplication')}
            </Button>
          )}
        </div>
        <DataTableToolbar table={table} filterFields={filterFields} />
      </DataTable>
    </div>
  )
}

export default Page
