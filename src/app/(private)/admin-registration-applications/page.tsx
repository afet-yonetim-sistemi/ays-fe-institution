'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import StatusFilter from '@/components/ui/status-filter'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import { usePagination } from '@/hooks/usePagination'
import { handleApiError } from '@/lib/handleApiError'
import {
  AdminRegistrationApplication,
  columns,
} from '@/modules/adminRegistrationApplications/components/columns'
import { AdminRegistrationApplicationsFilter } from '@/modules/adminRegistrationApplications/constants/types'
import { getAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { selectPermissions } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSort } from '@/hooks/useSort'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { adminApplicationRegistrationStatuses } from '@/modules/adminRegistrationApplications/constants/statuses'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userPermissions = useAppSelector(selectPermissions)
  const [
    adminRegistrationApplicationList,
    setAdminRegistrationApplicationList,
  ] = useState<AdminRegistrationApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const pageSize = 10
  const [filters, setFilters] = useState<AdminRegistrationApplicationsFilter>({
    page: 1,
    pageSize,
    statuses: [],
    sort: undefined,
  })

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: AdminRegistrationApplicationsFilter) => {
      setIsLoading(true)
      getAdminRegistrationApplications(filters)
        .then((response) => {
          if (response.data.isSuccess) {
            const { content, totalElementCount, totalPageCount } =
              response.data.response

            if (filters.page > totalPageCount) {
              router.push('/not-found')
              return
            }

            setAdminRegistrationApplicationList(content)
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

    const updatedFilters: AdminRegistrationApplicationsFilter = {
      page: currentPage,
      pageSize,
      statuses,
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">
          {t('adminRegistrationApplications.title')}
        </h1>
        <div className="flex items-center space-x-4">
          {userPermissions.includes(Permission.APPLICATION_CREATE) && (
            <Link href="/admin-registration-applications/pre-application">
              <Button>{t('preApplication')}</Button>
            </Link>
          )}
        </div>
      </div>
      <StatusFilter
        statuses={adminApplicationRegistrationStatuses}
        selectedStatuses={filters.statuses}
        onStatusChange={(statuses) => handleFilterChange('status', statuses)}
      />
      <DataTable
        columns={columns({ sort: filters.sort }, handleSortChange)}
        data={adminRegistrationApplicationList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.page}
        loading={isLoading}
      />
      <Toaster />
    </div>
  )
}

export default Page
