'use client'

import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatusFilter from '@/components/ui/status-filter'
import { Toaster } from '@/components/ui/toaster'
import { StatusData } from '@/constants/statusData'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { handleApiError } from '@/lib/handleApiError'
import { cn } from '@/lib/utils'
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
    fetchData(updatedFilters)
  }, [searchParams, fetchData, pageSize])

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
        <div className="relative">
          <Input
            id="roleName"
            placeholder=""
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className={cn(
              'block focus-visible:ring-0 focus-visible:ring-offset-0 p-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-[2px] border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            )}
          />
          <Label
            htmlFor="roleName"
            className="absolute !left-3 rounded cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-1.5 z-10 origin-[0] bg-white dark:bg-background peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1.5 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            {t('role.name')}
          </Label>
        </div>
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
