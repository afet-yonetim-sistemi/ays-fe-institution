'use client'

import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import StatusFilter from '@/components/ui/status-filter'
import { Toaster } from '@/components/ui/toaster'
import { toast } from '@/components/ui/use-toast'
import { getStringFilterValidation } from '@/constants/filterValidationSchema'
import { StatusData } from '@/constants/statusData'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { handleApiError } from '@/lib/handleApiError'
import { columns, Role } from '@/modules/roles/components/columns'
import { RolesFilter } from '@/modules/roles/constants/types'
import { getRoles } from '@/modules/roles/service'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const roleStatuses = StatusData.filter((status) =>
  ['ACTIVE', 'PASSIVE', 'DELETED'].includes(status.value)
)

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [roleList, setRoleList] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const pageSize = 10
  const [filters, setFilters] = useState<RolesFilter>({
    page: 1,
    pageSize,
    statuses: [],
    sort: undefined,
  })

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: RolesFilter) => {
      setIsLoading(true)
      getRoles(filters)
        .then((response) => {
          if (response.data.isSuccess) {
            const { content, totalElementCount, totalPageCount } =
              response.data.response
            if (filters.page > totalPageCount && totalPageCount > 0) {
              router.push('/not-found')
              return
            }
            setRoleList(content)
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
    const name = searchParams.get('name') ?? ''
    const statuses =
      statusesParam && statusesParam.trim() ? statusesParam.split(',') : []
    const sortParam = searchParams.get('sort')
    const [column = '', direction] = sortParam ? sortParam.split(',') : []

    const updatedFilters: RolesFilter = {
      page: currentPage,
      pageSize,
      statuses,
      name: name || '',
      sort: column
        ? { column, direction: direction as 'asc' | 'desc' | undefined }
        : undefined,
    }
    setFilters(updatedFilters)

    const result = getStringFilterValidation().safeParse(updatedFilters.name)
    if (name && !result.success) {
      toast({
        title: t('common.error'),
        description: t('filterValidation'),
        variant: 'destructive',
      })
    } else {
      fetchData(updatedFilters)
    }
  }, [searchParams, fetchData, pageSize, t])

  useEffect(() => {
    syncFiltersWithQuery()
  }, [syncFiltersWithQuery])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-medium">{t('roles')}</h1>
      <div className="flex items-center gap-4">
        <StatusFilter
          statuses={roleStatuses}
          selectedStatuses={filters.statuses}
          onStatusChange={(statuses) => handleFilterChange('status', statuses)}
        />
        <FilterInput
          id="name"
          label={t('name')}
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
        />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort }, handleSortChange)}
        data={roleList}
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
