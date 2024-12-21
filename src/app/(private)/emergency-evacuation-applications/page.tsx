'use client'

import { SortDirection } from '@/common/types'
import { Button } from '@/components/ui/button'
import CheckboxFilter from '@/components/ui/checkbox-filter'
import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/components/ui/use-toast'
import { getStringFilterValidation } from '@/constants/filterValidationSchema'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { handleApiError } from '@/lib/handleApiError'
import { columns } from '@/modules/emergencyEvacuationApplications/components/columns'
import { emergencyEvacuationApplicationStatuses } from '@/modules/emergencyEvacuationApplications/constants/statuses'
import {
  EmergencyEvacuationApplication,
  EmergencyEvacuationApplicationsFilter,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import { getEmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/service'
import { RefreshCw } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
      sort: [],
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
          if (!response.data.isSuccess) {
            handleApiError()
            return
          }

          const { content, totalElementCount, totalPageCount } =
            response.data.response

          if (filters.page > totalPageCount && totalPageCount != 0) {
            router.push('/not-found')
            return
          }

          setEmergencyEvacuationApplicationList(content)
          setTotalRows(totalElementCount)
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
      sort: column ? [{ column, direction: direction as SortDirection }] : [],
    }
    setFilters(updatedFilters)

    const fieldsToValidate = [
      'sourceCity',
      'sourceDistrict',
      'targetCity',
      'targetDistrict',
    ]
    for (const field of fieldsToValidate) {
      const value = updatedFilters[
        field as keyof typeof updatedFilters
      ] as string
      if (value && !getStringFilterValidation().safeParse(value).success) {
        toast({
          title: t('common.error'),
          description: t('filterValidation'),
          variant: 'destructive',
        })
        return
      }
    }

    fetchData(updatedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, fetchData, pageSize])

  useEffect(() => {
    syncFiltersWithQuery()
  }, [syncFiltersWithQuery])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-medium">
          {t('emergencyEvacuationApplications.title')}
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchData(filters)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4">
        <div className="flex items-center gap-4">
          <MultiSelectDropdown
            items={emergencyEvacuationApplicationStatuses}
            selectedItems={filters.statuses}
            onSelectionChange={(statuses) =>
              handleFilterChange('status', statuses)
            }
            label="status"
            renderItem={(item) => <Status status={item} />}
          />
          <CheckboxFilter
            label={t('isInPerson')}
            isChecked={filters.isInPerson ?? false}
            onChange={(checked) => handleFilterChange('isInPerson', checked)}
          />
          <FilterInput
            id="seatingCount"
            label={t('seatingCount')}
            value={filters.seatingCount}
            onChange={(e) => handleFilterChange('seatingCount', e.target.value)}
            type="number"
          />
        </div>
        <FilterInput
          id="referenceNumber"
          label={t('referenceNumber')}
          value={filters.referenceNumber}
          onChange={(e) =>
            handleFilterChange('referenceNumber', e.target.value)
          }
          type="number"
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
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
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
