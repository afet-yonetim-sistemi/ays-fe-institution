'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { z } from 'zod'
import { useDebounce } from './useDebounce'

interface UseDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  pageCount: number
  defaultPerPage?: number
  filterFields?: any[]
}

const schema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional(),
  referenceNumber: z.string().optional(),
})

export const useDataTable = <TData, TValue>({
  data,
  columns,
  pageCount,
  filterFields = [],
}: UseDataTableProps<TData, TValue>) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Search params
  const search = schema.parse(Object.fromEntries(searchParams))
  const page = search.page
  const sort = search.sort ?? null
  const [column, order] = sort?.toUpperCase().split('.') ?? []

  // Memoize computation of filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    }
  }, [filterFields])

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams],
  )

  // Initial column filters
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        const filterableColumn = filterableColumns.find(
          (column) => column.value === key,
        )
        const searchableColumn = searchableColumns.find(
          (column) => column.value === key,
        )
        if (filterableColumn) {
          filters.push({
            id: key,
            value: value.toUpperCase().split('.'),
          })
        } else if (searchableColumn) {
          filters.push({
            id: key,
            value: [value],
          })
        }

        return filters
      },
      [],
    )
  }, [filterableColumns, searchableColumns, searchParams])

  // Table states
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters)

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? '',
      desc: order === 'desc',
    },
  ])

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id
          ? `${sorting[0]?.id}.${sorting[0]?.desc ? 'desc' : 'asc'}`
          : null,
      })}`,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  // Handle server-side filtering
  const debouncedSearchableColumnFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter((filter) => {
          return searchableColumns.find((column) => column.value === filter.id)
        }),
      ),
      500,
    ),
  ) as ColumnFiltersState

  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.value === filter.id)
  })

  React.useEffect(() => {
    // Initialize new params
    const newParamsObject = {
      page: search.page,
    }

    // Handle debounced searchable column filters
    for (const column of debouncedSearchableColumnFilters) {
      if (typeof column.value === 'string') {
        Object.assign(newParamsObject, {
          [column.id]: 'string' === typeof column.value ? column.value : null,
        })
      }
    }

    // Handle filterable column filters
    for (const column of filterableColumnFilters) {
      if (typeof column.value === 'object' && Array.isArray(column.value)) {
        Object.assign(newParamsObject, { [column.id]: column.value.join('.') })
      }
    }

    // Remove deleted values
    const keys = Array.from(searchParams.keys())
    for (const key of keys) {
      if (
        (searchableColumns.find((column) => column.value === key) &&
          !debouncedSearchableColumnFilters.find(
            (column) => column.id === key,
          )) ||
        (filterableColumns.find((column) => column.value === key) &&
          !filterableColumnFilters.find((column) => column.id === key))
      ) {
        Object.assign(newParamsObject, { [key]: null })
      }
    }

    // After cumulating all the changes, push new params
    router.push(`${pathname}?${createQueryString(newParamsObject)}`)

    table.setPageIndex(0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(debouncedSearchableColumnFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filterableColumnFilters),
    pageCount,
  ])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return { table }
}
