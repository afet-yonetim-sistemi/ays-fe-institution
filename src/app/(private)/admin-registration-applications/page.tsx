'use client'

import { useEffect, useState } from 'react'
import PrivateRoute from '@/app/hocs/isAuth'
import SelectStatus from '@/modules/adminRegistrationApplications/components/selectStatus'
import Pagination from '@/components/ui/pagination'
import { postAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { useTranslation } from 'react-i18next'
import DataTable from '@/modules/adminRegistrationApplications/components/dataTable'
import { SortingState } from '@tanstack/react-table'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { pageSize } from '@/constants/common'
import { columns } from '@/modules/adminRegistrationApplications/components/columns'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface AdminRegistrationState {
  content: any[]
  totalPageCount: number
}

const Page = () => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [selectStatus, setSelectStatus] = useState<string[]>([])
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({ content: [], totalPageCount: 0 })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false,
    },
  ])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const sortBy = sorting.map((s) => `${s.desc ? 'DESC' : 'ASC'}`).join(',')
    setIsLoading(true)
    postAdminRegistrationApplications(
      currentPage,
      pageSize,
      selectStatus,
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
  }, [selectStatus, sorting, currentPage])

  return (
    <PrivateRoute>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <LoadingSpinner size={54} />
        </div>
      ) : (
        <div className="space-y-1">
          {error && <Toaster />}
          <div className="flex justify-between w-full gap-4">
            <h1>{t('adminRegistrationApplications')}</h1>
            <SelectStatus
              selectStatus={selectStatus}
              setSelectStatus={(state: string[]) => setSelectStatus(state)}
            />
          </div>
          <DataTable
            data={adminRegistration.content}
            columns={columns}
            sorting={sorting}
            setSorting={setSorting}
          />
          <div className="float-end">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={adminRegistration.totalPageCount}
            />
          </div>
        </div>
      )}
    </PrivateRoute>
  )
}

export default Page
