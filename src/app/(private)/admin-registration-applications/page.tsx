'use client'

import { Sort } from '@/common/types'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import StatusFilter from '@/components/ui/status-filter'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import { StatusData } from '@/constants/statusData'
import { usePagination } from '@/hooks/usePagination'
import { handleApiError } from '@/lib/handleApiError'
import {
  AdminRegistrationApplication,
  columns,
} from '@/modules/adminRegistrationApplications/components/columns'
import { AdminRegistrationApplicationsSearchParams } from '@/modules/adminRegistrationApplications/constants/types'
import { getAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { selectPermissions } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSort } from '@/hooks/useSort' // import the useSort hook

const adminApplicationRegistrationStatuses = StatusData.filter((status) =>
  ['WAITING', 'COMPLETED', 'REJECTED', 'APPROVED'].includes(status.value)
)

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
  const [totalRows, setTotalRows] = useState(0)
  const pageSize = 10
  const [filters, setFilters] = useState<{
    statuses: string[]
    sort: Sort
    currentPage: number
  }>({
    statuses: [],
    sort: { column: '', direction: null },
    currentPage: 1,
  })

  const { handlePageChange } = usePagination()
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (page: number, statuses: string[], sort: Sort) => {
      const searchParams: AdminRegistrationApplicationsSearchParams = {
        page,
        per_page: pageSize,
        sort: sort.direction
          ? { column: sort.column, direction: sort.direction }
          : undefined,
        statuses,
      }

      getAdminRegistrationApplications(searchParams)
        .then((response) => {
          if (response.data.isSuccess) {
            const { content, totalElementCount, totalPageCount } =
              response.data.response

            if (page > totalPageCount) {
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
    },
    [router]
  )

  const syncFiltersWithQuery = useCallback(() => {
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const statusesParam = searchParams.get('status')
    const statuses =
      statusesParam && statusesParam.trim() ? statusesParam.split(',') : []
    const sortParam = searchParams.get('sort')
    const [column = '', direction] = sortParam ? sortParam.split(',') : []

    setFilters({
      currentPage,
      statuses,
      sort: { column, direction: direction as 'asc' | 'desc' | null },
    })

    fetchData(currentPage, statuses, {
      column,
      direction: direction as 'asc' | 'desc' | null,
    })
  }, [searchParams, fetchData])

  useEffect(() => {
    syncFiltersWithQuery()
  }, [syncFiltersWithQuery])

  const handleStatusChange = (statuses: string[]) => {
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set('page', '1')
    updatedParams.set('status', statuses.join(','))
    router.push(`${pathname}?${updatedParams.toString()}`)
  }

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
      <div>
        <StatusFilter
          statuses={adminApplicationRegistrationStatuses}
          selectedStatuses={filters.statuses}
          onStatusChange={handleStatusChange}
        />
      </div>
      <DataTable
        columns={columns(filters, handleSortChange)}
        data={adminRegistrationApplicationList}
        totalElements={totalRows}
        pageSize={pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.currentPage}
      />
      <Toaster />
    </div>
  )
}

export default Page
