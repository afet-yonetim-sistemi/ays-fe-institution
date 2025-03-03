'use client'

import { SortDirection } from '@/common/types'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { Toaster } from '@/components/ui/toaster'
import { getStringFilterValidation } from '@/constants/filterValidationSchema'
import { Permission } from '@/constants/permissions'
import useDebouncedInputFilter from '@/hooks/useDebouncedInputFilter'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { toast } from '@/hooks/useToast'
import { handleApiError } from '@/lib/handleApiError'
import { selectPermissions } from '@/modules/auth/authSlice'
import { columns, Role } from '@/modules/roles/components/columns'
import { roleStatuses } from '@/modules/roles/constants/statuses'
import { RolesFilter } from '@/modules/roles/constants/types'
import { getRoles } from '@/modules/roles/service'
import { useAppSelector } from '@/store/hooks'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const parseRolesSearchParams = (searchParams: URLSearchParams) => {
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
  const statusesParam = searchParams.get('status')
  const name = searchParams.get('name') ?? ''
  const statuses = statusesParam?.trim() ? statusesParam.split(',') : []
  const sortParam = searchParams.get('sort')
  const [column = '', direction] = sortParam ? sortParam.split(',') : []

  return {
    currentPage,
    statuses,
    name,
    column,
    direction,
  }
}

const getInitialFilters = (searchParams: URLSearchParams): RolesFilter => {
  const { currentPage, statuses, name, column, direction } =
    parseRolesSearchParams(searchParams)

  return {
    page: currentPage,
    pageSize: 10,
    statuses,
    name: name ?? '',
    sort: column ? [{ column, direction: direction as SortDirection }] : [],
  }
}

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userPermissions = useAppSelector(selectPermissions)
  const [roleList, setRoleList] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [filters, setFilters] = useState<RolesFilter>(() =>
    getInitialFilters(searchParams)
  )

  const [nameInputValue, setNameInputValue] = useState(filters.name ?? '')

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const debouncedHandleInputFilterChange =
    useDebouncedInputFilter(handleFilterChange)
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: RolesFilter) => {
      setIsLoading(true)
      getRoles(filters)
        .then((response) => {
          if (!response.data.isSuccess) {
            handleApiError()
            return
          }

          const { content, totalElementCount, totalPageCount } =
            response.data.response

          if (filters.page > totalPageCount && totalPageCount !== 0) {
            router.push('/not-found')
            return
          }

          setRoleList(content)
          setTotalRows(totalElementCount)
        })
        .catch((error) => {
          handleApiError(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [router]
  )

  const syncFiltersWithQuery = useCallback(() => {
    const { currentPage, statuses, name, column, direction } =
      parseRolesSearchParams(searchParams)

    const updatedFilters: RolesFilter = {
      page: currentPage,
      pageSize: 10,
      statuses,
      name: name ?? '',
      sort: column ? [{ column, direction: direction as SortDirection }] : [],
    }
    setFilters(updatedFilters)
  }, [searchParams])

  useEffect(() => {
    syncFiltersWithQuery()
  }, [syncFiltersWithQuery])

  useEffect(() => {
    setNameInputValue(filters.name ?? '')
  }, [filters.name])

  useEffect(() => {
    const result = getStringFilterValidation().safeParse(filters.name)
    if (filters.name && !result.success) {
      const errorMessage = result.error.errors[0]?.message || 'common.error'
      toast({
        title: 'common.error',
        description: errorMessage,
        variant: 'destructive',
      })
      return
    }
    fetchData(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">{t('roles')}</h1>
        <div className="flex items-center space-x-4">
          {userPermissions.includes(Permission.ROLE_CREATE) && (
            <Link href="/roles/create-role">
              <Button>{t('role.create')}</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <MultiSelectDropdown
          items={roleStatuses}
          selectedItems={filters.statuses}
          onSelectionChange={(statuses) =>
            handleFilterChange('status', statuses)
          }
          label="status"
          renderItem={(item) => <Status status={item} />}
        />
        <FilterInput
          id="name"
          label={t('name')}
          value={nameInputValue}
          onChange={(e) => {
            setNameInputValue(e.target.value)
            debouncedHandleInputFilterChange('name', e.target.value)
          }}
        />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={roleList}
        totalElements={totalRows}
        pageSize={filters.pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.ROLE_DETAIL)}
      />
      <Toaster />
    </div>
  )
}

export default Page
