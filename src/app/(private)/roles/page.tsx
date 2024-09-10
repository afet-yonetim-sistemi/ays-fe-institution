'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/ui/use-toast'
import { useSearchParams } from 'next/navigation'
import { postRoles } from '@/modules/roles/service'
import { searchParamsSchema } from '@/modules/roles/constants/searchParamsSchema'
import { Roles } from '@/modules/roles/constants/types'
import { useDataTable } from '@/app/hocs/useDataTable'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import { columns } from '@/modules/roles/components/columns'
import filterFields from '@/modules/roles/constants/filterFields'

const Page = (): JSX.Element => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  )

  const { t } = useTranslation()
  const { toast } = useToast()
  const [data, setData] = useState<Roles>({
    content: [],
    totalPageCount: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const searchParamsString = useMemo(() => JSON.stringify(search), [search])

  useEffect(() => {
    setIsLoading(true)
    postRoles({
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
  }, [
    searchParamsString,
    search.createdAt,
    search.name,
    search.page,
    search.per_page,
    search.sort,
    search.status,
    search.updatedAt,
    t,
    toast,
  ])

  const { table } = useDataTable({
    data: data.content,
    columns,
    pageCount: data.totalPageCount,
    filterFields,
  })

  return (
    <div className="space-y-1">
      <DataTable
        className="px-2"
        table={table}
        loading={isLoading}
        enableRowClick
      >
        <div className="flex flex-col w-full gap-4">
          <h1 className="text-2xl font-medium">{t('roles')}</h1>
          <DataTableToolbar table={table} filterFields={filterFields} />
        </div>
      </DataTable>
    </div>
  )
}

export default Page
