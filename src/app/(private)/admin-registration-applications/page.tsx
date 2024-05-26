'use client'
import PrivateRoute from '@/app/hocs/isAuth'
import SelectStatus from '@/components/adminRegistrationApplications/selectStatus'
import { useEffect, useState } from 'react'
import Pagination from '@/components/adminRegistrationApplications/pagination'
import { postAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { useTranslation } from 'react-i18next'
import DataTable from '@/components/adminRegistrationApplications/dataTable'
import { SortingState } from '@tanstack/react-table'
interface AdminRegistrationState {
  content: []
  totalPageCount: number
}
const Page = ({ searchParams }: { searchParams: any }) => {
  const [selectStatus, setSelectStatus] = useState([])
  const [adminRegistration, setAdminRegistration] =
    useState<AdminRegistrationState>({ content: [], totalPageCount: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const { t } = useTranslation()

  let page = searchParams.page || 1
  useEffect(() => {
    const sortBy = sorting.map((s) => `${s.desc ? 'DESC' : 'ASC'}`).join(',')
    postAdminRegistrationApplications(page, 10, selectStatus, sortBy)
      .then((responseData) => {
        setIsLoading(false)
        setAdminRegistration(responseData.data.response)
        setIsLoading(true)
      })
      .catch((error) => {
        console.error('Request failed:', error)
      })
  }, [selectStatus, sorting, page])
  if (!isLoading) {
    return <div>Loading...</div>
  }
  return (
    <PrivateRoute>
      <div className="space-y-1">
        <div className="flex justify-between w-full gap-4">
          <h1>{t('admin.adminRegistrationApplications')}</h1>
          <SelectStatus setSelectStatus={setSelectStatus} />
        </div>
        <DataTable
          data={adminRegistration?.content}
          sorting={sorting}
          setSorting={setSorting}
        />
        <Pagination totalPage={adminRegistration?.totalPageCount} />
      </div>
    </PrivateRoute>
  )
}
export default Page
