'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import useDebouncedInputFilter from '@/hooks/useDebouncedInputFilter'
import { useDataFetcher } from '@/hooks/useDataFetcher'
import { useSearchParamsManager } from '@/hooks/useSearchParamsManager'
import { useSort } from '@/hooks/useSort'
import { selectPermissions } from '@/modules/auth/authSlice'
import { columns, User } from '@/modules/users/components/columns'
import { userStatuses } from '@/modules/users/constants/statuses'
import type { UsersFilter } from '@/modules/users/constants/types'
import { getUsers } from '@/modules/users/service'
import { useAppSelector } from '@/store/hooks'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usersFilterConfig } from '@/modules/users/constants/filterConfig'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)

  const {
    filters,
    filterErrors,
    inputValues,
    handleFilterChange,
    handlePageChange,
    handleInputValueChange,
  } = useSearchParamsManager<UsersFilter>({
    config: usersFilterConfig.searchParams,
    validationRules: usersFilterConfig.validationRules,
    defaultFilters: usersFilterConfig.defaultFilters,
  })

  const {
    data: userList,
    isLoading,
    totalRows,
    fetchData,
    refetch,
  } = useDataFetcher<User, UsersFilter>({
    fetchFunction: getUsers,
  })

  const debouncedHandleInputFilterChange =
    useDebouncedInputFilter(handleFilterChange)
  const handleSortChange = useSort(filters.sort)

  useEffect(() => {
    const hasFilterErrors = Object.values(filterErrors).some(
      (error) => error !== null
    )
    if (!hasFilterErrors && filters.page) {
      fetchData(filters)
    }
  }, [filters, filterErrors, fetchData])

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
      <div className="grid grid-cols-3 2xl:grid-cols-6 gap-4">
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
          id="firstName"
          label={t('user.firstName')}
          value={inputValues.firstName || ''}
          onChange={(e) => {
            handleInputValueChange('firstName', e.target.value)
            debouncedHandleInputFilterChange('firstName', e.target.value)
          }}
          error={filterErrors.firstName}
        />
        <FilterInput
          id="lastName"
          label={t('user.lastName')}
          value={inputValues.lastName || ''}
          onChange={(e) => {
            handleInputValueChange('lastName', e.target.value)
            debouncedHandleInputFilterChange('lastName', e.target.value)
          }}
          error={filterErrors.lastName}
        />
        <FilterInput
          id="emailAddress"
          label={t('user.email')}
          value={inputValues.emailAddress || ''}
          onChange={(e) => {
            handleInputValueChange('emailAddress', e.target.value)
            debouncedHandleInputFilterChange('emailAddress', e.target.value)
          }}
          error={filterErrors.emailAddress}
        />
        <FilterInput
          id="lineNumber"
          label={t('user.lineNumber')}
          value={inputValues.lineNumber || ''}
          onChange={(e) => {
            handleInputValueChange('lineNumber', e.target.value)
            debouncedHandleInputFilterChange('lineNumber', e.target.value)
          }}
          error={filterErrors.lineNumber}
        />
        <FilterInput
          id="city"
          label={t('user.city')}
          value={inputValues.city || ''}
          onChange={(e) => {
            handleInputValueChange('city', e.target.value)
            debouncedHandleInputFilterChange('city', e.target.value)
          }}
          error={filterErrors.city}
        />
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
