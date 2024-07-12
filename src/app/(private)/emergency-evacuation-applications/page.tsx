'use client'

import { useEffect, useState } from 'react'
import PrivateRoute from '@/app/hocs/isAuth'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { useDataTable } from '@/app/hocs/useDataTable'
import { DataTable, DataTableToolbar } from '@/components/dataTable'
import { useSearchParams } from 'next/navigation'
import filterFields from '@/modules/emergencyEvacuationApplications/constants/filterFields'
import { postEmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/service'
import { columns } from '@/modules/emergencyEvacuationApplications/components/columns'
import { Permission } from '@/constants/permissions'
import { searchParamsSchema } from '@/modules/emergencyEvacuationApplications/constants/searchParamsSchema'
import { EmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/constants/types'
import QuickFilter from '@/components/ui/quickFilter'

const Page = () => {
  const searchParams = useSearchParams()
  const search = searchParamsSchema.parse(
    Object.fromEntries(searchParams.entries()),
  )

  const { t } = useTranslation()
  const { toast } = useToast()
  const [data, setData] = useState<EmergencyEvacuationApplications>({
    content: [],
    totalPageCount: 0,
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
      .catch((error) => {
        setError(error.message)
        toast({
          title: t('error'),
          description: t('defaultError'),
          variant: 'destructive',
        })
      })
      .finally(() => setIsLoading(false))
  }, [
    search.page,
    search.per_page,
    search.sort,
    search.status,
    search.referenceNumber,
    search.seatingCount,
    search.sourceCity,
    search.sourceDistrict,
    search.targetCity,
    search.targetDistrict,
    search.isInPerson,
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
    <PrivateRoute requiredPermissions={[Permission.EVACUATION_LIST]}>
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
              {t('emergencyEvacuationApplications')}
            </h1>
            <DataTableToolbar table={table} filterFields={filterFields}>
              <QuickFilter label={t('isInPerson')} value="isInPerson" />
            </DataTableToolbar>
          </div>
        </DataTable>
      </div>
    </PrivateRoute>
  )
}

export default Page
