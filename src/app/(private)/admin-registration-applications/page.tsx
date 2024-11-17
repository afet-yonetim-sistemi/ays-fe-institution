'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import StatusFilter from '@/components/ui/status-filter'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import { StatusData } from '@/constants/statusData'
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
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const adminApplicationRegistrationStatuses = StatusData.filter((status) =>
  ['WAITING', 'COMPLETED', 'REJECTED', 'APPROVED'].includes(status.value)
)

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const userPermissions = useAppSelector(selectPermissions)
  const [
    adminRegistrationApplicationList,
    setAdminRegistrationApplicationList,
  ] = useState<AdminRegistrationApplication[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [filters, setFilters] = useState<{
    statuses: string[]
    sort: {
      column: string
      direction: 'asc' | 'desc' | ''
    }
    currentPage: number
  }>({
    statuses: [],
    sort: { column: '', direction: '' },
    currentPage: 1,
  })

  const pageSize = 10

  const fetchData = useCallback(
    (
      page: number,
      statuses: string[],
      sort: { column: string; direction: 'asc' | 'desc' | '' }
    ) => {
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
            handleApiError(response.data)
          }
        })
        .catch((error) => {
          handleApiError(error)
        })
    },
    [router]
  )

  const initialFetch = useCallback(() => {
    const statusQuery = filters.statuses.length
      ? `&status=${filters.statuses.join(',')}`
      : ''
    const sortQuery =
      filters.sort.column && filters.sort.direction
        ? `&sort=${filters.sort.column},${filters.sort.direction}`
        : ''

    const queryString = `/admin-registration-applications?page=${filters.currentPage}${statusQuery}${sortQuery}`
    router.push(queryString)

    fetchData(filters.currentPage, filters.statuses, filters.sort)
  }, [filters, fetchData, router])

  useEffect(() => {
    initialFetch()
  }, [initialFetch])

  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: page,
    }))
  }

  const handleStatusChange = (statuses: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      statuses,
      currentPage: 1,
    }))
  }

  const handleSortChange = (column: { id: string }) => {
    const columnId = column.id
    let newDirection: '' | 'asc' | 'desc' = ''

    if (filters.sort.column === columnId) {
      newDirection =
        filters.sort.direction === 'asc'
          ? 'desc'
          : filters.sort.direction === 'desc'
            ? ''
            : 'asc'
    } else {
      newDirection = 'asc'
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      sort: { column: columnId, direction: newDirection },
      currentPage: 1,
    }))
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
        columns={columns(handleSortChange)}
        data={adminRegistrationApplicationList}
        totalElements={totalRows}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        currentPage={filters.currentPage}
      />
      <Toaster />
    </div>
  )
}

export default Page
