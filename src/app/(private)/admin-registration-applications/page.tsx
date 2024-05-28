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

interface AdminRegistrationState {
  content: any[]
  totalPageCount: number
}

const Page = ({ searchParams }: { searchParams: any }) => {
  const { t } = useTranslation()
  const [selectStatus, setSelectStatus] = useState<string[]>([])
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({ content: [], totalPageCount: 0 })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sorting, setSorting] = useState<SortingState>([])

  const page = searchParams.page || 1

  useEffect(() => {
    const sortBy = sorting
      .map((s) => `${s.id},${s.desc ? 'DESC' : 'ASC'}`)
      .join(',')
    setIsLoading(true)
    postAdminRegistrationApplications(page, 10, selectStatus, sortBy)
      .then((responseData) => {
        setAdminRegistration(responseData.data.response)
      })
      .catch((error) => {
        console.error('Request failed:', error)
      })
      .finally(() => setIsLoading(false))
  }, [selectStatus, sorting, page])

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <PrivateRoute>
      <div className="space-y-1">
        <div className="flex justify-between w-full gap-4">
          <h1>{t('adminRegistrationApplications')}</h1>
          <SelectStatus
            selectStatus={selectStatus}
            setSelectStatus={setSelectStatus}
          />
        </div>
        <DataTable
          data={adminRegistration.content}
          sorting={sorting}
          setSorting={setSorting}
        />
        <Pagination page={page} totalPage={adminRegistration.totalPageCount} />
      </div>
    </PrivateRoute>
  )
}

export default Page
