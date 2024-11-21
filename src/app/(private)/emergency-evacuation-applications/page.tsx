'use client'

import CheckboxFilter from '@/components/ui/checkbox-filter'
import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import StatusFilter from '@/components/ui/status-filter'
import { Toaster } from '@/components/ui/toaster'
import { StatusData } from '@/constants/statusData'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { handleApiError } from '@/lib/handleApiError'
import { columns } from '@/modules/emergencyEvacuationApplications/components/columns'
import {
  EmergencyEvacuationApplication,
  EmergencyEvacuationApplicationsFilter,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import { getEmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/service'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const emergencyEvacuationApplicationStatuses = StatusData.filter((status) =>
  [
    'PENDING',
    'IN_REVIEW',
    'RECEIVED_FIRST_APPROVE',
    'RECEIVED_SECOND_APPROVE',
    'RECEIVED_THIRD_APPROVE',
    'COMPLETED',
    'CANCELLED',
  ].includes(status.value)
)

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [
    emergencyEvacuationApplicationList,
    setEmergencyEvacuationApplicationList,
  ] = useState<EmergencyEvacuationApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const pageSize = 10
  const [filters, setFilters] = useState<EmergencyEvacuationApplicationsFilter>(
    {
      page: 1,
      pageSize,
      statuses: [],
      sort: undefined,
    }
  )

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: EmergencyEvacuationApplicationsFilter) => {
      setIsLoading(true)
      getEmergencyEvacuationApplications(filters)
        .then((response) => {
          if (response.data.isSuccess) {
            const { content, totalElementCount, totalPageCount } =
              response.data.response
            if (filters.page > totalPageCount && totalPageCount > 0) {
              router.push('/not-found')
              return
            }
            setEmergencyEvacuationApplicationList(content)
            setTotalRows(totalElementCount)
          } else {
            handleApiError()
          }
        })
        .catch((error) => {
          handleApiError(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [router]
  )

  const syncFiltersWithQuery = useCallback(() => {
    const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
    const statusesParam = searchParams.get('status')
    const statuses =
      statusesParam && statusesParam.trim() ? statusesParam.split(',') : []
    const sortParam = searchParams.get('sort')
    const [column = '', direction] = sortParam ? sortParam.split(',') : []

    const referenceNumber = searchParams.get('referenceNumber') ?? ''
    const sourceCity = searchParams.get('sourceCity') ?? ''
    const sourceDistrict = searchParams.get('sourceDistrict') ?? ''

    const seatingCountParam = searchParams.get('seatingCount')
    const seatingCount =
      seatingCountParam && seatingCountParam.trim()
        ? parseInt(seatingCountParam, 10)
        : undefined

    const targetCity = searchParams.get('targetCity') ?? ''
    const targetDistrict = searchParams.get('targetDistrict') ?? ''

    const isInPersonParam = searchParams.get('isInPerson')
    const isInPerson = isInPersonParam === 'true' ? true : undefined

    const updatedFilters: EmergencyEvacuationApplicationsFilter = {
      page: currentPage,
      pageSize,
      statuses,
      referenceNumber: referenceNumber || '',
      sourceCity: sourceCity || '',
      sourceDistrict: sourceDistrict || '',
      seatingCount,
      targetCity: targetCity || '',
      targetDistrict: targetDistrict || '',
      isInPerson,
      sort: column
        ? { column, direction: direction as 'asc' | 'desc' | undefined }
        : undefined,
    }

    setFilters(updatedFilters)
    fetchData(updatedFilters)
  }, [searchParams, fetchData, pageSize])

  useEffect(() => {
    syncFiltersWithQuery()
  }, [syncFiltersWithQuery])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-medium">
        {t('emergencyEvacuationApplications.title')}
      </h1>
      <div className="flex items-center gap-4">
        <FilterInput
          id="referenceNumber"
          label={t('referenceNumber')}
          value={filters.referenceNumber}
          onChange={(e) =>
            handleFilterChange('referenceNumber', e.target.value)
          }
        />
        <FilterInput
          id="seatingCount"
          label={t('seatingCount')}
          value={filters.seatingCount}
          onChange={(e) => handleFilterChange('seatingCount', e.target.value)}
        />
        <StatusFilter
          statuses={emergencyEvacuationApplicationStatuses}
          selectedStatuses={filters.statuses}
          onStatusChange={(statuses) => handleFilterChange('status', statuses)}
        />
        <CheckboxFilter
          label={t('isInPerson')}
          isChecked={filters.isInPerson ?? false}
          onChange={(checked) => handleFilterChange('isInPerson', checked)}
        />
        <FilterInput
          id="sourceCity"
          label={t('sourceCity')}
          value={filters.sourceCity}
          onChange={(e) => handleFilterChange('sourceCity', e.target.value)}
        />
        <FilterInput
          id="sourceDistrict"
          label={t('sourceDistrict')}
          value={filters.sourceDistrict}
          onChange={(e) => handleFilterChange('sourceDistrict', e.target.value)}
        />
        <FilterInput
          id="targetCity"
          label={t('targetCity')}
          value={filters.targetCity}
          onChange={(e) => handleFilterChange('targetCity', e.target.value)}
        />
        <FilterInput
          id="targetDistrict"
          label={t('targetDistrict')}
          value={filters.targetDistrict}
          onChange={(e) => handleFilterChange('targetDistrict', e.target.value)}
        />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort }, handleSortChange)}
        data={emergencyEvacuationApplicationList}
        totalElements={totalRows}
        pageSize={pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.page}
        loading={isLoading}
      />
      <Toaster />
    </div>
  )
}

export default Page
