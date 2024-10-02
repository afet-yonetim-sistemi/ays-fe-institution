'use client'

import { useEffect, useState } from 'react'
import { postAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { useTranslation } from 'react-i18next'
import { pageSize } from '@/constants/common'
import { columns } from '@/modules/adminRegistrationApplications/components/columns'
import { Toaster } from '@/components/ui/toaster'
import { useSearchParams } from 'next/navigation'
import { useDataTable } from '@/app/hocs/useDataTable'
import * as z from 'zod'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import filterFields from '@/modules/adminRegistrationApplications/constants/filterFields'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'
import Link from 'next/link'
import { handleApiError } from '@/lib/handleApiError'

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
  const userPermissions = useAppSelector(selectPermissions)
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({
      content: [],
      totalPageCount: 0,
    })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
        setErrorMessage(error.message)
        handleApiError(error)
      })
      .finally(() => setIsLoading(false))
  }, [search.page, search.per_page, search.sort, search.status, t])

  const { table } = useDataTable({
    data: adminRegistration.content,
    columns,
    pageCount: adminRegistration.totalPageCount,
    filterFields,
  })

  return (
    <div className="space-y-1">
      {errorMessage && <Toaster />}
      <DataTable table={table} loading={isLoading} enableRowClick>
        <div className="flex items-center justify-between w-full gap-4">
          <h1 className="text-2xl font-medium">
            {t('adminRegistrationApplications.title')}
          </h1>
          {userPermissions.includes(Permission.APPLICATION_CREATE) && (
            <Link href="/admin-registration-applications/pre-application">
              <Button>{t('preApplication')}</Button>
            </Link>
          )}
        </div>
        <DataTableToolbar table={table} filterFields={filterFields} />
      </DataTable>
    </div>
  )
}

export default Page
