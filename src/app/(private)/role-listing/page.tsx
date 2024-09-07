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
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import { columns } from '@/modules/roleListing/components/columns'
import filterFields from '@/modules/roleListing/constants/filterFields'

const Page = ():PrivateRoute => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  )

  const { t } = useTranslation()
  const { toast } = useToast()
  const [data, setData] = useState<RoleListing>({
    content: [],
    totalPageCount: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const searchParamsString = JSON.stringify(search)

  const fetchData = ():void => {
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
      .catch(() => {
        toast({
          title: t('error'),
          description: t('defaultError'),
          variant: 'destructive',
        })
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (search?.name == undefined || search?.name?.length >= 2) {
      fetchData()
    }
  }, [searchParamsString])

  const { table } = useDataTable({
    data: data.content,
    columns,
    pageCount: data.totalPageCount,
    filterFields,
  })

  return (
    <PrivateRoute requiredPermissions={[Permission.ROLE_LIST]}>
      <div className="space-y-1">
        <DataTable
          className="px-2"
          table={table}
          loading={isLoading}
          enableRowClick
        >
          <div className="flex flex-col w-full gap-4">
            <h1 className="text-2xl font-medium">{t('roleListing')}</h1>
            <DataTableToolbar table={table} filterFields={filterFields} />
          </div>
        </DataTable>
      </div>
    </PrivateRoute>
  )
}

export default Page
