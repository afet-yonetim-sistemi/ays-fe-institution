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

interface AdminRegistrationState {
  content: any[]
  totalPageCount: number
}

const Page = ({ searchParams }: { searchParams: any }) => {
  const { t } = useTranslation()
  const [selectStatus, setSelectStatus] = useState<string[]>([])
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({ content: [], totalPageCount: 0 })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sorting, setSorting] = useState<SortingState>([])

  const page = searchParams.page || 1

  useEffect(() => {
    const sortBy = sorting.map((s) => `${s.desc ? 'DESC' : 'ASC'}`).join(',')
    setIsLoading(true)
    postAdminRegistrationApplications(page, pageSize, selectStatus, sortBy)
      .then((responseData) => {
        setAdminRegistration(responseData.data.response)
      })
      .catch((error) => {
        console.error('Request failed:', error)
      })
      .finally(() => setIsLoading(false))
  }, [selectStatus, sorting, page])

  return (
    <PrivateRoute>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <LoadingSpinner size={54} />
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex justify-between w-full gap-4">
            <h1>{t('adminRegistrationApplications')}</h1>
            <SelectStatus
              selectStatus={selectStatus}
              setSelectStatus={(state: string[]) => setSelectStatus(state)}
            />
          </div>
          <DataTable
            data={adminRegistration.content}
            sorting={sorting}
            setSorting={setSorting}
          />
          <Pagination
            page={page}
            totalPage={adminRegistration.totalPageCount}
          />
        </div>
      )}
    </PrivateRoute>
  )
}

export default Page
