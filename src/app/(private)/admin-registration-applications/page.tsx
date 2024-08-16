'use client'

import { useEffect, useState } from 'react'
import PrivateRoute from '@/app/hocs/isAuth'
import { postAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { useTranslation } from 'react-i18next'
import { pageSize } from '@/constants/common'
import { columns } from '@/modules/adminRegistrationApplications/components/columns'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useSearchParams } from 'next/navigation'
import { Permission } from '@/constants/permissions'
import { useDataTable } from '@/app/hocs/useDataTable'
import * as z from 'zod'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import filterFields from '@/modules/adminRegistrationApplications/constants/filterFields'

interface AdminRegistrationState {
  content: any[]
  totalPageCount: number
}

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(pageSize),
  sort: z.string().optional(),
  status: z.string().optional(),
})

const Page = () => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  )

  const { t } = useTranslation()
  const { toast } = useToast()
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

  return (
    <PrivateRoute requiredPermissions={[Permission.APPLICATION_LIST]}>
      <div className="space-y-1">
        {error && <Toaster />}
        <DataTable
          className=""
          table={table}
          loading={isLoading}
          enableRowClick
        >
          <div className="flex flex-col w-full gap-4">
            <h1 className="text-2xl font-medium">
              {t('adminRegistrationApplications.title')}
            </h1>
            <DataTableToolbar table={table} filterFields={filterFields} />
          </div>
        </DataTable>
      </div>
    </PrivateRoute>
  )
}

export default Page
