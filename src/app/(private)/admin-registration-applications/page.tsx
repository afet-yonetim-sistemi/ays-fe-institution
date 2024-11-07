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
import { useRouter, useSearchParams } from 'next/navigation'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOptions, setFilterOptions] = useState<{ statuses: string[] }>({
    statuses: [],
  })

  const pageSize = 10
  const searchParams = useSearchParams()

  const fetchData = useCallback(
    (page: number, statuses: string[]) => {
      const searchParams: AdminRegistrationApplicationsSearchParams = {
        page,
        per_page: pageSize,
        sort: '',
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

  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') ?? '1')
    const statusParam = searchParams.get('status')
    const initialStatuses = statusParam ? statusParam.split(',') : []

    setCurrentPage(currentPage)
    setFilterOptions({ statuses: initialStatuses })
    fetchData(currentPage, initialStatuses)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    router.push(
      `/admin-registration-applications?page=${page}&status=${filterOptions.statuses.join(',')}`
    )
  }

  const handleStatusChange = (statuses: string[]) => {
    setFilterOptions({ statuses })
    router.push(
      `/admin-registration-applications?page=1&status=${statuses.join(',')}`
    )
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
          selectedStatuses={filterOptions.statuses}
          onStatusChange={handleStatusChange}
        />
      </div>
      <DataTable
        columns={columns}
        data={adminRegistrationApplicationList}
        totalElements={totalRows}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
      <Toaster />
    </div>
  )
}

export default Page
