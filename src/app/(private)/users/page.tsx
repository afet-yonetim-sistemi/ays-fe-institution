'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import { useDataFetcher } from '@/hooks/useDataFetcher'
import { useSearchParamsManager } from '@/hooks/useSearchParamsManager'
import { useSort } from '@/hooks/useSort'
import { selectPermissions } from '@/modules/auth/authSlice'
import { columns, User } from '@/modules/users/components/columns'
import { usersFilterConfig } from '@/modules/users/constants/filterConfig'
import { userStatuses } from '@/modules/users/constants/statuses'
import type { UsersFilter } from '@/modules/users/constants/types'
import { getUsers } from '@/modules/users/service'
import { useAppSelector } from '@/store/hooks'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)

  const {
    filters,
    hasFilterErrors,
    handleFilterChange,
    handlePageChange,
    getFilterInputProps,
  } = useSearchParamsManager<UsersFilter>({
    config: usersFilterConfig.searchParams,
    validationRules: usersFilterConfig.validationRules,
    defaultFilters: usersFilterConfig.defaultFilters,
  })

  const {
    data: userList,
    isLoading,
    totalRows,
    refetch,
  } = useDataFetcher<User, UsersFilter>({
    fetchFunction: getUsers,
    filters,
    enabled: !hasFilterErrors && filters.page > 0,
  })

  const handleSortChange = useSort(filters.sort)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-medium">{t('user.title')}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch(filters)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          {userPermissions.includes(Permission.USER_CREATE) && (
            <Link href="/users/create-user">
              <Button>{t('user.create')}</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 2xl:grid-cols-6">
        <MultiSelectDropdown
          items={userStatuses}
          selectedItems={filters.statuses}
          onSelectionChange={(statuses) =>
            handleFilterChange('statuses', statuses)
          }
          label="user.statusFilter"
          renderItem={(item) => <Status status={item} />}
        />
        <FilterInput
          label={t('user.firstName')}
          {...getFilterInputProps('firstName')}
        />
        <FilterInput
          label={t('user.lastName')}
          {...getFilterInputProps('lastName')}
        />
        <FilterInput
          label={t('user.email')}
          {...getFilterInputProps('emailAddress')}
        />
        <FilterInput
          label={t('user.lineNumber')}
          {...getFilterInputProps('lineNumber')}
        />
        <FilterInput label={t('user.city')} {...getFilterInputProps('city')} />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={userList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={(page) => handlePageChange(page)}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.USER_DETAIL)}
      />
      <Toaster />
    </div>
  )
}

export default Page
