'use client'

import { Sort } from '@/common/types'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import FilterInput from '@/components/ui/filter-input'
import MultiSelectDropdown from '@/components/ui/multi-select-dropdown'
import Status from '@/components/ui/status'
import { Toaster } from '@/components/ui/toaster'
import { Permission } from '@/constants/permissions'
import useDebouncedInputFilter from '@/hooks/useDebouncedInputFilter'
import { useHandleFilterChange } from '@/hooks/useHandleFilterChange'
import { usePagination } from '@/hooks/usePagination'
import { useSort } from '@/hooks/useSort'
import { getFilterErrors } from '@/lib/getFilterErrors'
import { showErrorToast } from '@/lib/showToast'
import { selectPermissions } from '@/modules/auth/authSlice'
import { columns, User } from '@/modules/users/components/columns'
import { userStatuses } from '@/modules/users/constants/statuses'
import { UsersFilter } from '@/modules/users/constants/types'
import { getUsers } from '@/modules/users/service'
import { useAppSelector } from '@/store/hooks'
import { RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const parseUsersSearchParams = (searchParams: URLSearchParams) => {
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
  const statusesParam = searchParams.get('status')
  const statuses = statusesParam?.trim() ? statusesParam.split(',') : []
  const sortParam = searchParams.get('sort')
  const sort: Sort[] = sortParam?.trim()
    ? sortParam.split(';').map((s) => {
        const [column, direction] = s.split(',')
        return { column, direction } as Sort
      })
    : []

  const firstName = searchParams.get('firstName') ?? ''
  const lastName = searchParams.get('lastName') ?? ''
  const emailAddress = searchParams.get('emailAddress') ?? ''
  const lineNumber = searchParams.get('lineNumber') ?? ''
  const city = searchParams.get('city') ?? ''

  return {
    currentPage,
    statuses,
    firstName,
    lastName,
    emailAddress,
    lineNumber,
    city,
    sort,
  }
}

const getInitialFilters = (searchParams: URLSearchParams): UsersFilter => {
  const {
    currentPage,
    statuses,
    firstName,
    lastName,
    emailAddress,
    lineNumber,
    city,
    sort,
  } = parseUsersSearchParams(searchParams)

  return {
    page: currentPage,
    pageSize: 10,
    statuses,
    firstName: firstName || '',
    lastName: lastName || '',
    emailAddress: emailAddress || '',
    lineNumber,
    city: city || '',
    sort,
  }
}

const Page = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const userPermissions = useAppSelector(selectPermissions)

  const [userList, setUserList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [filters, setFilters] = useState<UsersFilter>(() =>
    getInitialFilters(searchParams)
  )
  const [filterErrors, setFilterErrors] = useState<
    Record<string, string | null>
  >({})
  const [firstNameInput, setFirstNameInput] = useState(filters.firstName ?? '')
  const [lastNameInput, setLastNameInput] = useState(filters.lastName ?? '')
  const [emailAddressInput, setEmailAddressInput] = useState(
    filters.emailAddress ?? ''
  )
  const [lineNumberInput, setLineNumberInput] = useState(
    filters.lineNumber ?? ''
  )
  const [cityInput, setCityInput] = useState(filters.city ?? '')

  const { handlePageChange } = usePagination()
  const handleFilterChange = useHandleFilterChange()
  const debouncedHandleInputFilterChange =
    useDebouncedInputFilter(handleFilterChange)
  const handleSortChange = useSort(filters.sort)

  const fetchData = useCallback(
    (filters: UsersFilter) => {
      setIsLoading(true)
      getUsers(filters)
        .then((response) => {
          if (!response.data.isSuccess) {
            showErrorToast()
            return
          }

          const { content, totalElementCount, totalPageCount } =
            response.data.response

          if (filters.page > totalPageCount && totalPageCount !== 0) {
            router.push('/not-found')
            return
          }

          setUserList(content)
          setTotalRows(totalElementCount)
        })
        .catch((error) => {
          showErrorToast(error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [router]
  )

  useEffect(() => {
    const paramsReady = searchParams.toString().length > 0
    if (!paramsReady) return

    const parsedFilters = getInitialFilters(searchParams)

    const nameValidationRule = {
      min: 2,
      max: 100,
      regex: /^(?!\d+$)[\p{L}\d\p{P} ]+$/u,
    }

    const validationRules = {
      emailAddress: { min: 0, max: 254 },
      lineNumber: { min: 0, max: 10 },
      city: {
        min: 2,
        max: 100,
        regex: /^(?!\d+$)[\p{L}\d\p{P} ]+$/u,
      },
      firstName: nameValidationRule,
      lastName: nameValidationRule,
    }

    const errors = getFilterErrors(
      parsedFilters,
      ['firstName', 'lastName', 'emailAddress', 'city', 'lineNumber'],
      validationRules
    )

    setFilterErrors(errors)
    setFilters(parsedFilters)
    setFirstNameInput(parsedFilters.firstName ?? '')
    setLastNameInput(parsedFilters.lastName ?? '')
    setEmailAddressInput(parsedFilters.emailAddress ?? '')
    setCityInput(parsedFilters.city ?? '')
    setLineNumberInput(parsedFilters.lineNumber ?? '')

    const hasFilterErrors = Object.values(errors).some(
      (error) => error !== null
    )
    if (!hasFilterErrors) {
      fetchData(parsedFilters)
    }
  }, [searchParams, fetchData])

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
          label="user.statusFilter"
          renderItem={(item) => <Status status={item} />}
        />
        <FilterInput
          id="firstName"
          label={t('user.firstName')}
          value={firstNameInput}
          onChange={(e) => {
            setFirstNameInput(e.target.value)
            debouncedHandleInputFilterChange('firstName', e.target.value)
          }}
          error={filterErrors.firstName}
        />
        <FilterInput
          id="lastName"
          label={t('user.lastName')}
          value={lastNameInput}
          onChange={(e) => {
            setLastNameInput(e.target.value)
            debouncedHandleInputFilterChange('lastName', e.target.value)
          }}
          error={filterErrors.lastName}
        />
        <FilterInput
          id="emailAddress"
          label={t('user.email')}
          value={emailAddressInput}
          onChange={(e) => {
            setEmailAddressInput(e.target.value)
            debouncedHandleInputFilterChange('emailAddress', e.target.value)
          }}
          error={filterErrors.emailAddress}
        />
        <FilterInput
          id="lineNumber"
          label={t('user.lineNumber')}
          value={lineNumberInput}
          onChange={(e) => {
            setLineNumberInput(e.target.value)
            debouncedHandleInputFilterChange('lineNumber', e.target.value)
          }}
          error={filterErrors.lineNumber}
        />
        <FilterInput
          id="city"
          label={t('user.city')}
          value={cityInput}
          onChange={(e) => {
            setCityInput(e.target.value)
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
