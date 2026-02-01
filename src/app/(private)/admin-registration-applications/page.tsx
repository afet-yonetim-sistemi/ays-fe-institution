'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import { useDataFetcher } from '@/hooks/useDataFetcher'
import { useSearchParamsManager } from '@/hooks/useSearchParamsManager'
import { useSort } from '@/hooks/useSort'
import { columns } from '@/modules/adminRegistrationApplications/components/columns'
import { adminRegistrationApplicationsFilterConfig } from '@/modules/adminRegistrationApplications/constants/filterConfig'
import { adminApplicationRegistrationStatuses } from '@/modules/adminRegistrationApplications/constants/statuses'
import {
  AdminRegistrationApplication,
  AdminRegistrationApplicationsFilter,
} from '@/modules/adminRegistrationApplications/constants/types'
import { getAdminRegistrationApplications } from '@/modules/adminRegistrationApplications/service'
import { selectPermissions } from '@/modules/auth/authSlice'
import { useAppSelector } from '@/store/hooks'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)

  const { filters, hasFilterErrors, handleFilterChange, handlePageChange } =
    useSearchParamsManager<AdminRegistrationApplicationsFilter>({
      config: adminRegistrationApplicationsFilterConfig.searchParams,
      validationRules:
        adminRegistrationApplicationsFilterConfig.validationRules,
      defaultFilters: adminRegistrationApplicationsFilterConfig.defaultFilters,
    })

  const {
    data: adminRegistrationApplicationList,
    isLoading,
    totalRows,
    refetch,
  } = useDataFetcher<
    AdminRegistrationApplication,
    AdminRegistrationApplicationsFilter
  >({
    fetchFunction: getAdminRegistrationApplications,
    filters,
    enabled: !hasFilterErrors && filters.page > 0,
  })

  const handleSortChange = useSort(filters.sort)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-medium">
            {t('application.admin.title')}
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch(filters)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          {userPermissions.includes(Permission.APPLICATION_CREATE) && (
            <Link href="/admin-registration-applications/pre-application">
              <Button>{t('application.admin.preliminary.button')}</Button>
            </Link>
          )}
        </div>
      </div>
      <MultiSelectDropdown
        items={adminApplicationRegistrationStatuses}
        selectedItems={filters.statuses}
        onSelectionChange={(statuses) =>
          handleFilterChange('statuses', statuses)
        }
        label="status.title"
        renderItem={(item) => <Status status={item} />}
      />
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={adminRegistrationApplicationList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={handlePageChange}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.APPLICATION_DETAIL)}
      />
      <Toaster />
    </div>
  )
}

export default Page
