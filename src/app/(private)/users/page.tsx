'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Toaster } from '@/components/ui/toaster'
import { usePagination } from '@/hooks/usePagination'
import { handleApiError } from '@/lib/handleApiError'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSort } from '@/hooks/useSort'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { columns, User } from '@/modules/users/components/columns'
import { UsersFilter } from '@/modules/users/constants/types'
import { getUsers } from '@/modules/users/service'
import FilterInput from '@/components/ui/filter-input'
import { RefreshCw } from 'lucide-react'
import { userStatuses } from '@/modules/users/constants/statuses'
import { Sort } from '@/common/types'
import { getStringFilterValidation } from '@/constants/filterValidationSchema'
import { toast } from '@/components/ui/use-toast'
import { useAppSelector } from '@/store/hooks'
import { selectPermissions } from '@/modules/auth/authSlice'
import { Permission } from '@/constants/permissions'
import Link from 'next/link'
import { debounce } from 'lodash'

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userPermissions = useAppSelector(selectPermissions)
  const [userList, setUserList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const pageSize = 10
  const [filters, setFilters] = useState<UsersFilter>({
    page: 1,
    pageSize,
    statuses: [],
    sort: [],
  })

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: UsersFilter) => {
      setIsLoading(true)
      getUsers(filters)
        .then((response) => {
          if (!response.data.isSuccess) {
            handleApiError()
            return
          }

          const { content, totalElementCount, totalPageCount } =
            response.data.response

          if (filters.page > totalPageCount && totalPageCount != 0) {
            router.push('/not-found')
            return
          }

          setUserList(content)
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
    const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
    const statusesParam = searchParams.get('status')
    const statuses =
      statusesParam && statusesParam.trim() ? statusesParam.split(',') : []

    const sortParam = searchParams.get('sort')
    const sort: Sort[] =
      sortParam && sortParam.trim()
        ? sortParam.split(';').map((s) => {
            const [column, direction] = s.split(',')
            return { column, direction } as Sort
          })
        : []

    const firstName = searchParams.get('firstName') ?? ''
    const lastName = searchParams.get('lastName') ?? ''
    const emailAddress = searchParams.get('emailAddress') ?? ''
    const lineNumberParam = searchParams.get('lineNumber')
    const lineNumber =
      lineNumberParam && lineNumberParam.trim()
        ? parseInt(lineNumberParam, 10)
        : undefined

    const city = searchParams.get('city') ?? ''

    const updatedFilters: UsersFilter = {
      page: currentPage,
      pageSize,
      statuses,
      firstName: firstName || '',
      lastName: lastName || '',
      emailAddress: emailAddress || '',
      lineNumber,
      city: city || '',
      sort,
    }
    setFilters(updatedFilters)
  }, [searchParams, pageSize])

  useEffect(() => {
    syncFiltersWithQuery()
  }, [syncFiltersWithQuery])

  const debouncedFetchData = useMemo(
    () =>
      debounce((filters: UsersFilter) => {
        const fieldsToValidate = [
          'firstName',
          'lastName',
          'emailAddress',
          'city',
        ]

        for (const field of fieldsToValidate) {
          const value = filters[field as keyof UsersFilter]
          if (value && !getStringFilterValidation().safeParse(value).success) {
            toast({
              title: t('common.error'),
              description: t('filterValidation'),
              variant: 'destructive',
            })
            return
          }
        }

        fetchData(filters)
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchData]
  )

  useEffect(() => {
    debouncedFetchData(filters)
    return () => {
      debouncedFetchData.cancel()
    }
  }, [filters, debouncedFetchData])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-medium">{t('user.title')}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchData(filters)}
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
            handleFilterChange('status', statuses)
          }
          label="user.status"
          renderItem={(item) => <Status status={item} />}
        />
        <FilterInput
          id="firstName"
          label={t('user.firstName')}
          value={filters.firstName}
          onChange={(e) => handleFilterChange('firstName', e.target.value)}
        />
        <FilterInput
          id="lastName"
          label={t('user.lastName')}
          value={filters.lastName}
          onChange={(e) => handleFilterChange('lastName', e.target.value)}
        />
        <FilterInput
          id="emailAddress"
          label={t('user.email')}
          value={filters.emailAddress}
          onChange={(e) => handleFilterChange('emailAddress', e.target.value)}
        />
        <FilterInput
          id="lineNumber"
          label={t('user.lineNumber')}
          value={filters.lineNumber}
          onChange={(e) => handleFilterChange('lineNumber', e.target.value)}
          type="number"
        />
        <FilterInput
          id="city"
          label={t('user.city')}
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />
      </div>
      <DataTable
        columns={columns({ sort: filters.sort ?? [] }, handleSortChange)}
        data={userList}
        totalElements={totalRows}
        pageSize={pageSize}
        onPageChange={(page) => handlePageChange(page, pathname)}
        currentPage={filters.page}
        loading={isLoading}
        enableRowClick={userPermissions.includes(Permission.USER_DETAIL)}
      />
      <Toaster />
    </div>
  )
}

export default Page
