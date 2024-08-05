'use client'

import { useEffect, useState } from 'react'
import PrivateRoute from '@/app/hocs/isAuth'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/ui/use-toast'
import { useSearchParams } from 'next/navigation'
import { Permission } from '@/constants/permissions'
import { postRoleListing } from '@/modules/roleListing/service'
import { searchParamsSchema } from '@/modules/roleListing/constants/searchParamsSchema'
import { RoleListing } from '@/modules/roleListing/constants/types'
import { useDataTable } from '@/app/hocs/useDataTable'
import { Toaster } from '@/components/ui/toaster'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import FilterInput from '@/components/ui/filterInput'
import { columns } from '@/modules/roleListing/components/columns'
import filterFields from '@/modules/roleListing/constants/filterFields'

const Page = () => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  )

  const { t } = useTranslation()
  const { toast } = useToast()
  const [data, setData] = useState<RoleListing>({
    content: [],
    totalPageCount: 0
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    postRoleListing({
      page: search.page,
      per_page: search.per_page,
      sort: search.sort,
      status: search.status,
      name: search.name,
      createdAt: search.createdAt,
      updatedAt: search.updatedAt,
    })
      .then((responseData) => {
        setData(responseData.data.response)
      })
      .catch((error) => {
        setError(error.message)
        toast({
          title: t('error'),
          description: t('defaultError'),
          variant: 'destructive'
        })
      })
      .finally(() => setIsLoading(false))
  }, [
    JSON.stringify(search)
  ])

  const { table } = useDataTable({
    data: data.content,
    columns,
    pageCount: data.totalPageCount,
    filterFields
  })

  return (
    <PrivateRoute requiredPermissions={[Permission.ROLE_LIST]}>
      <div className="space-y-1">
        {error && <Toaster />}
        <DataTable
          className="px-2"
          table={table}
          loading={isLoading}
          enableRowClick
        >
          <div className="flex flex-col w-full gap-4">
            <h1 className="text-2xl font-medium">
              {t('roleListing')}
            </h1>
            <DataTableToolbar table={table} filterFields={filterFields}>
              <FilterInput min={2} max={255} param="roleName" />
            </DataTableToolbar>
          </div>
        </DataTable>
      </div>
    </PrivateRoute>
  )
}

export default Page
