'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)
  const [
    adminRegistrationApplicationList,
    setAdminRegistrationApplicationList,
  ] = useState<AdminRegistrationApplication[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const fetchData = (page: number) => {
    const searchParams: AdminRegistrationApplicationsSearchParams = {
      page,
      per_page: pageSize,
      sort: '',
      status: '',
    }

    getAdminRegistrationApplications(searchParams)
      .then((response) => {
        if (response.data.isSuccess) {
          setAdminRegistrationApplicationList(response.data.response.content)
          setTotalRows(response.data.response.totalElementCount)
        } else {
          handleApiError(response.data)
        }
      })
      .catch((error) => {
        handleApiError(error)
      })
  }

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">
          {t('adminRegistrationApplications.title')}
        </h1>
        {userPermissions.includes(Permission.APPLICATION_CREATE) && (
          <Link href="/admin-registration-applications/pre-application">
            <Button>{t('preApplication')}</Button>
          </Link>
        )}
      </div>
      <DataTable
        columns={columns}
        data={adminRegistrationApplicationList}
        totalRows={totalRows}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />
      <Toaster />
    </div>
  )
}

export default Page
