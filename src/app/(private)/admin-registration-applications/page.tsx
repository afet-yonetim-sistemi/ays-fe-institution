'use client'

import { useEffect, useState } from 'react'
import PrivateRoute from '@/app/hocs/isAuth'
import SelectStatus from '@/modules/adminRegistrationApplications/components/selectStatus'
import Pagination from '@/components/ui/pagination'
import { postAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { useTranslation } from 'react-i18next'
import DataTable from '@/modules/adminRegistrationApplications/components/dataTable'
import { SortingState } from '@tanstack/react-table'
import { pageSize } from '@/constants/common'
import { columns } from '@/modules/adminRegistrationApplications/components/columns'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface AdminRegistrationState {
  content: any[]
  totalPageCount: number
}

const Page = ({
  searchParams,
}: {
  searchParams: {
    filter?: string
    page?: string
  }
}) => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({ content: [], totalPageCount: 0 })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false,
    },
  ])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sortBy = sorting.map((s) => `${s.desc ? 'DESC' : 'ASC'}`).join(',')
    const filterStatus = searchParams.filter?.split(',') || []
    setIsLoading(true)
    postAdminRegistrationApplications(
      Number(searchParams.page || 1),
      pageSize,
      filterStatus,
      sortBy,
    )
      .then((responseData) => {
        setAdminRegistration(responseData.data.response)
      })
      .catch((error) => {
        setError(error.message)
        toast({
          title: t('error'),
          description: t('defaultError'),
          variant: 'destructive',
        })
      })
      .finally(() => setIsLoading(false))
  }, [searchParams, sorting])

  return (
    <PrivateRoute>
      <div className="flex justify-between items-center w-full gap-4">
        <h1 className="text-2xl font-medium">
          {t('adminRegistrationApplications')}
        </h1>
        <SelectStatus />
      </div>
      <div className="space-y-1">
        {error && <Toaster />}
        <DataTable
          data={adminRegistration.content}
          columns={columns}
          sorting={sorting}
          setSorting={setSorting}
          loading={isLoading}
          enableRowClick
        />
        {!isLoading && (
          <div className="float-end">
            <Pagination totalPages={adminRegistration.totalPageCount} />
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}

export default Page

