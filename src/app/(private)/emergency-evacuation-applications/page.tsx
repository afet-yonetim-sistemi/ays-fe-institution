/* eslint-disable max-lines-per-function */
'use client'

import { SortDirection } from '@/common/types'
import {
  Button,
  CheckboxFilter,
  DataTable,
  FilterInput,
  MultiSelectDropdown,
  Status,
  Toaster,
} from '@/components/ui'

import { Permission } from '@/constants/permissions'
import { numericRegex } from '@/constants/regex'
import useDebouncedInputFilter from '@/hooks/useDebouncedInputFilter'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { getFilterErrors } from '@/lib/getFilterErrors'
import { showErrorToast } from '@/lib/showToast'
import { selectPermissions } from '@/modules/auth/authSlice'
import { columns } from '@/modules/emergencyEvacuationApplications/components/columns'
import { emergencyEvacuationApplicationStatuses } from '@/modules/emergencyEvacuationApplications/constants/statuses'
import {
  EmergencyEvacuationApplication,
  EmergencyEvacuationApplicationsFilter,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import { getEmergencyEvacuationApplications } from '@/modules/emergencyEvacuationApplications/service'
import { useAppSelector } from '@/store/hooks'
import { RefreshCw } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const parseEEASearchParams = (
  searchParams: URLSearchParams
): {
  currentPage: number
  statuses: string[]
  referenceNumber: string
  sourceCity: string
  sourceDistrict: string
  seatingCount: number | undefined
  targetCity: string
  targetDistrict: string
  isInPerson: boolean | undefined
  column: string
  direction: string
} => {
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
  const statusesParam = searchParams.get('status')
  const statuses = statusesParam?.trim() ? statusesParam.split(',') : []
  const sortParam = searchParams.get('sort')
  const [column = '', direction] = sortParam ? sortParam.split(',') : []

  const isInPersonParam = searchParams.get('isInPerson')
  const isInPerson = isInPersonParam === 'true' ? true : undefined
  const seatingCountParam = searchParams.get('seatingCount')
  const seatingCount = seatingCountParam?.trim()
    ? parseInt(seatingCountParam, 10)
    : undefined
  const referenceNumber = searchParams.get('referenceNumber') ?? ''
  const sourceCity = searchParams.get('sourceCity') ?? ''
  const sourceDistrict = searchParams.get('sourceDistrict') ?? ''
  const targetCity = searchParams.get('targetCity') ?? ''
  const targetDistrict = searchParams.get('targetDistrict') ?? ''

  return {
    currentPage,
    statuses,
    referenceNumber,
    sourceCity,
    sourceDistrict,
    seatingCount,
    targetCity,
    targetDistrict,
    isInPerson,
    column,
    direction,
  }
}

const getInitialFilters = (
  searchParams: URLSearchParams
): EmergencyEvacuationApplicationsFilter => {
  const {
    currentPage,
    statuses,
    referenceNumber,
    sourceCity,
    sourceDistrict,
    seatingCount,
    targetCity,
    targetDistrict,
    isInPerson,
    column,
    direction,
  } = parseEEASearchParams(searchParams)

  return {
    page: currentPage,
    pageSize: 10,
    statuses,
    isInPerson,
    seatingCount,
    referenceNumber: referenceNumber || '',
    sourceCity: sourceCity || '',
    sourceDistrict: sourceDistrict || '',
    targetCity: targetCity || '',
    targetDistrict: targetDistrict || '',
    sort: column ? [{ column, direction: direction as SortDirection }] : [],
  }
}

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userPermissions = useAppSelector(selectPermissions)

  const [
    emergencyEvacuationApplicationList,
    setEmergencyEvacuationApplicationList,
  ] = useState<EmergencyEvacuationApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)

  // Memoize filters to prevent infinite re-renders
  const filters = useMemo(
    () => getInitialFilters(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  )

  const locationValidationRule = {
    min: 2,
    max: 100,
    regex: /^(?!\d+$)[\p{L}\d\p{P} ]+$/u,
  }

  const validationRules = {
    sourceCity: locationValidationRule,
    sourceDistrict: locationValidationRule,
    targetCity: locationValidationRule,
    targetDistrict: locationValidationRule,
  }

  // Memoize filterErrors to prevent infinite re-renders
  const filterErrors = useMemo(
    () =>
      getFilterErrors(
        filters,
        ['sourceCity', 'sourceDistrict', 'targetCity', 'targetDistrict'],
        validationRules
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters]
  )

  const [seatingCountInput, setSeatingCountInput] = useState(
    filters.seatingCount ?? ''
  )
  const [referenceNumberInput, setReferenceNumberInput] = useState(
    filters.referenceNumber ?? ''
  )
  const [sourceCityInput, setSourceCityInput] = useState(
    filters.sourceCity ?? ''
  )
  const [sourceDistrictInput, setSourceDistrictInput] = useState(
    filters.sourceDistrict ?? ''
  )
  const [targetCityInput, setTargetCityInput] = useState(
    filters.targetCity ?? ''
  )
  const [targetDistrictInput, setTargetDistrictInput] = useState(
    filters.targetDistrict ?? ''
  )

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const debouncedHandleInputFilterChange =
    useDebouncedInputFilter(handleFilterChange)
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: EmergencyEvacuationApplicationsFilter) => {
      setIsLoading(true)
      getEmergencyEvacuationApplications(filters)
        .then((response) => {
          if (!response.data.isSuccess) {
            showErrorToast()
            return
          }

          const { content, totalElementCount, totalPageCount } =
            response.data.response

          if (filters.page > totalPageCount && totalPageCount !== 0) {
            router.push('/not-found')
            return
          }

          setEmergencyEvacuationApplicationList(content)
          setTotalRows(totalElementCount)
        })
        .catch((error) => {
          showErrorToast(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [router]
  )

  useEffect(() => {
    const paramsReady = searchParams.toString().length > 0
    if (!paramsReady) return

    setTimeout(() => {
      setReferenceNumberInput(filters.referenceNumber ?? '')
      setSourceCityInput(filters.sourceCity ?? '')
      setSourceDistrictInput(filters.sourceDistrict ?? '')
      setTargetCityInput(filters.targetCity ?? '')
      setTargetDistrictInput(filters.targetDistrict ?? '')
      setSeatingCountInput(filters.seatingCount?.toString() ?? '')
    }, 0)

    const hasFilterErrors = Object.values(filterErrors).some(
      (error) => error !== null
    )
    if (!hasFilterErrors) {
      setTimeout(() => fetchData(filters), 0)
    }
  }, [searchParams, fetchData, filterErrors, filters])

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-2xl font-medium">
          {t('application.evacuation.title')}
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchData(filters)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 2xl:grid-cols-4">
        <MultiSelectDropdown
          items={emergencyEvacuationApplicationStatuses}
          selectedItems={filters.statuses}
          onSelectionChange={(statuses) =>
            handleFilterChange('status', statuses)
          }
          label="application.status"
          renderItem={(item) => <Status status={item} />}
        />
        <CheckboxFilter
          label={t('application.evacuation.inPerson')}
          isChecked={filters.isInPerson ?? false}
          onChange={(checked: boolean) =>
            handleFilterChange('isInPerson', checked)
          }
        />
        <FilterInput
          id="seatingCount"
          label={t('application.evacuation.seatingCount')}
          inputMode="numeric"
          maxLength={3}
          onInput={(e) => {
            ;(e.target as HTMLInputElement).value = (
              e.target as HTMLInputElement
            ).value.replace(numericRegex, '')
          }}
          value={seatingCountInput}
          onChange={(e) => {
            setSeatingCountInput(e.target.value)
            debouncedHandleInputFilterChange('seatingCount', e.target.value)
          }}
        />
        <FilterInput
          id="referenceNumber"
          label={t('application.evacuation.referenceNumber')}
          value={referenceNumberInput}
          onChange={(e) => {
            setReferenceNumberInput(e.target.value)
            debouncedHandleInputFilterChange('referenceNumber', e.target.value)
          }}
        />
        <FilterInput
          id="sourceCity"
          label={t('application.evacuation.sourceCity')}
          value={sourceCityInput}
          onChange={(e) => {
            setSourceCityInput(e.target.value)
            debouncedHandleInputFilterChange('sourceCity', e.target.value)
          }}
          error={filterErrors.sourceCity}
        />
        <FilterInput
          id="sourceDistrict"
          label={t('application.evacuation.sourceDistrict')}
          value={sourceDistrictInput}
          onChange={(e) => {
            setSourceDistrictInput(e.target.value)
            debouncedHandleInputFilterChange('sourceDistrict', e.target.value)
          }}
          error={filterErrors.sourceDistrict}
        />
        <FilterInput
          id="targetCity"
          label={t('application.evacuation.targetCity')}
          value={targetCityInput}
          onChange={(e) => {
            setTargetCityInput(e.target.value)
            debouncedHandleInputFilterChange('targetCity', e.target.value)
          }}
          error={filterErrors.targetCity}
        />
        <FilterInput
          id="targetDistrict"
          label={t('application.evacuation.targetDistrict')}
          value={targetDistrictInput}
          onChange={(e) => {
            setTargetDistrictInput(e.target.value)
            debouncedHandleInputFilterChange('targetDistrict', e.target.value)
          }}
          error={filterErrors.targetDistrict}
        />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={emergencyEvacuationApplicationList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.EVACUATION_DETAIL)}
      />
      <Toaster />
    </div>
  )
}

export default Page
