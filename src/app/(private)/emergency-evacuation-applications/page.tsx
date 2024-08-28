'use client'

import { useEffect, useState } from 'react'
import PrivateRoute from '@/app/hocs/isAuth'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/ui/use-toast'
import { useDataTable } from '@/app/hocs/useDataTable'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import { useSearchParams } from 'next/navigation'
import filterFields from '@/modules/emergencyEvacuationApplications/constants/filterFields'
import { postEmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/service'
import { columns } from '@/modules/emergencyEvacuationApplications/components/columns'
import { Permission } from '@/constants/permissions'
import { searchParamsSchema } from '@/modules/emergencyEvacuationApplications/constants/searchParamsSchema'
import { EmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/constants/types'
import FilterInput from '@/components/ui/filterInput'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

const Page = () => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries())
  )

  const { t } = useTranslation()
  const { toast } = useToast()
  const [data, setData] = useState<EmergencyEvacuationApplications>({
    content: [],
    totalPageCount: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const searchParamsString = JSON.stringify(search)

  const fetchData = () => {
    setIsLoading(true)
    postEmergencyEvacuationApplications({
      page: search.page,
      per_page: search.per_page,
      sort: search.sort,
      status: search.status,
      referenceNumber: search.referenceNumber,
      seatingCount: Number(search.seatingCount),
      sourceCity: search.sourceCity,
      sourceDistrict: search.sourceDistrict,
      targetCity: search.targetCity,
      targetDistrict: search.targetDistrict,
      isInPerson: search.isInPerson,
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
    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString])

  const { table } = useDataTable({
    data: data.content,
    columns,
    pageCount: data.totalPageCount,
    filterFields,
  })
  return (
    <PrivateRoute requiredPermissions={[Permission.EVACUATION_LIST]}>
      <div className="space-y-1">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-medium">
            {t('emergencyEvacuationApplications.title')}
          </h1>
          <Button variant="outline" size="icon" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <DataTable
          className="px-2"
          table={table}
          loading={isLoading}
          enableRowClick
        >
          <DataTableToolbar table={table} filterFields={filterFields}>
            <FilterInput min={2} max={100} param="sourceCity" />
            <FilterInput min={2} max={100} param="sourceDistrict" />
            <FilterInput min={2} max={100} param="targetCity" />
            <FilterInput min={2} max={100} param="targetDistrict" />
          </DataTableToolbar>
        </DataTable>
      </div>
    </PrivateRoute>
  )
}

export default Page
