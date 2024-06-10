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

interface AdminRegistrationState {
  content: any[]
  totalPageCount: number
}

const Page = () => {
  const { t } = useTranslation()
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
        console.error('Request failed:', error)
      })
      .finally(() => setIsLoading(false))
  }, [selectStatus, sorting, currentPage])

  return (
    <PrivateRoute>
      <div className="flex justify-between items-center w-full gap-4">
        <h1 className="font-semibold">{t('adminRegistrationApplications')}</h1>
        <SelectStatus
          selectStatus={selectStatus}
          setSelectStatus={(state: string[]) => setSelectStatus(state)}
        />
      </div>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <LoadingSpinner size={54} />
        </div>
      ) : (
        <div className="space-y-1">
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
