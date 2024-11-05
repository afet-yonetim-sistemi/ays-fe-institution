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

  useEffect(() => {
    const searchParams: AdminRegistrationApplicationsSearchParams = {
      page: 1,
      per_page: 10,
      sort: '',
      status: '',
    }

    getAdminRegistrationApplications(searchParams)
      .then((response) => {
        if (response.data.isSuccess) {
          setAdminRegistrationApplicationList(response.data.response.content)
        } else {
          handleApiError(response.data)
        }
      })
      .catch((error) => {
        handleApiError(error)
      })
  }, [])

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
      <DataTable columns={columns} data={adminRegistrationApplicationList} />
      <Toaster />
    </div>
  )
}

export default Page
