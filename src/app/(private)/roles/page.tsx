'use client'

import { DataTable } from '@/components/custom/data-table'
import FilterInput from '@/components/custom/filter-input'
import MultiSelectDropdown from '@/components/custom/multi-select-dropdown'
import Status from '@/components/custom/status'
import { Permission } from '@/constants/permissions'
import { useDataFetcher } from '@/hooks/useDataFetcher'
import { useSearchParamsManager } from '@/hooks/useSearchParamsManager'
import { useSort } from '@/hooks/useSort'
import { selectPermissions } from '@/modules/auth/authSlice'
import { columns, Role } from '@/modules/roles/components/columns'
import { rolesFilterConfig } from '@/modules/roles/constants/filterConfig'
import { roleStatuses } from '@/modules/roles/constants/statuses'
import { RolesFilter } from '@/modules/roles/constants/types'
import { getRoles } from '@/modules/roles/service'
import { Button } from '@/shadcn/ui/button'
import { useAppSelector } from '@/store/hooks'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const Page = (): React.ReactNode => {
  const { t } = useTranslation()
  const userPermissions = useAppSelector(selectPermissions)

  const {
    filters,
    hasFilterErrors,
    handleFilterChange,
    handlePageChange,
    getFilterInputProps,
  } = useSearchParamsManager<RolesFilter>({
    config: rolesFilterConfig.searchParams,
    validationRules: rolesFilterConfig.validationRules,
    defaultFilters: rolesFilterConfig.defaultFilters,
  })

  const {
    data: roleList,
    isLoading,
    totalRows,
    refetch,
  } = useDataFetcher<Role, RolesFilter>({
    fetchFunction: getRoles,
    filters,
    enabled: !hasFilterErrors && filters.page > 0,
  })

  const handleSortChange = useSort(filters.sort)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-medium">{t('role.title')}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch(filters)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          {userPermissions.includes(Permission.ROLE_CREATE) && (
            <Link href="/roles/create-role">
              <Button>{t('role.create')}</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 2xl:grid-cols-6">
        <MultiSelectDropdown
          items={roleStatuses}
          selectedItems={filters.statuses}
          onSelectionChange={(statuses) =>
            handleFilterChange('statuses', statuses)
          }
          label="role.status"
          renderItem={(item) => <Status status={item} />}
        />
        <FilterInput label={t('role.name')} {...getFilterInputProps('name')} />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={roleList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={(page) => handlePageChange(page)}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.ROLE_DETAIL)}
      />
    </div>
  )
}

export default Page
