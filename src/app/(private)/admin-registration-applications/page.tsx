'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import { usePagination } from '@/hooks/usePagination'
import { showErrorToast } from '@/lib/showToast'
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
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { SortDirection } from '@/common/types'

const parseARASearchParams = (searchParams: URLSearchParams) => {
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
  const statusesParam = searchParams.get('status')
  const statuses = statusesParam?.trim() ? statusesParam.split(',') : []
  const sortParam = searchParams.get('sort')
  const [column = '', direction] = sortParam ? sortParam.split(',') : []

  return {
    currentPage,
    statuses,
    column,
    direction,
  }
}

const getInitialFilters = (
  searchParams: URLSearchParams
): AdminRegistrationApplicationsFilter => {
  const { currentPage, statuses, column, direction } =
    parseARASearchParams(searchParams)

  return {
    page: currentPage,
    pageSize: 10,
    statuses,
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
    adminRegistrationApplicationList,
    setAdminRegistrationApplicationList,
  ] = useState<AdminRegistrationApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [filters, setFilters] = useState<AdminRegistrationApplicationsFilter>(
    () => getInitialFilters(searchParams)
  )

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: AdminRegistrationApplicationsFilter) => {
      setIsLoading(true)
      getAdminRegistrationApplications(filters)
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

          setAdminRegistrationApplicationList(content)
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

    const parsedFilters = getInitialFilters(searchParams)
    setFilters(parsedFilters)

    fetchData(parsedFilters)
  }, [searchParams, fetchData])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">{t('application.admin.title')}</h1>
        <div className="flex items-center space-x-4">
          {userPermissions.includes(Permission.APPLICATION_CREATE) && (
            <Link href="/admin-registration-applications/pre-application">
              <Button>{t('application.admin.preliminary.button')}</Button>
            </Link>
          )}
        </div>
      </div>
      <MultiSelectDropdown
        items={adminApplicationRegistrationStatuses}
        selectedItems={filters.statuses}
        onSelectionChange={(statuses) => handleFilterChange('status', statuses)}
        label="status.title"
        renderItem={(item) => <Status status={item} />}
      />
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={adminRegistrationApplicationList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.APPLICATION_DETAIL)}
      />
      <Toaster />
    </div>
  )
}

export default Page
