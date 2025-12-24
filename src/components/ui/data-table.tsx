/* eslint-disable max-lines-per-function, complexity, @typescript-eslint/explicit-function-return-type, react-hooks/incompatible-library */
'use client'

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { LoadingType, LoadingTypeValue } from '@/constants/loadingType'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { t } from 'i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { DataTableSkeleton } from './data-table-skeleton'
import { LoadingSpinner } from './loadingSpinner'
interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalElements: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
  enableRowClick?: boolean
  loading: boolean
  loadingType?: LoadingTypeValue
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  totalElements,
  pageSize,
  currentPage,
  onPageChange,
  enableRowClick = true,
  loading,
  loadingType = LoadingType.SKELETON,
}: Readonly<DataTableProps<TData, TValue>>): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasPageQuery = searchParams.get('page') !== null

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', currentPage.toString())

    if (!hasPageQuery) {
      router.replace(url.toString())
    } else {
      router.push(url.toString())
    }
  }, [currentPage, router, hasPageQuery])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.ceil(totalElements / pageSize)

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  const handleRowClick = (row: TData): void => {
    if (enableRowClick) {
      router.push(`${pathname}/details?id=${row.id}`)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-secondary text-left font-bold text-secondary-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && loadingType === LoadingType.SKELETON && (
              <DataTableSkeleton columns={columns} pageSize={pageSize} />
            )}
            {loading && loadingType === LoadingType.SPINNER && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex h-full items-center justify-center">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('common.noResult')}
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original)}
                  className={
                    enableRowClick
                      ? 'hover:accent cursor-pointer'
                      : 'cursor-default'
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || totalPages === 0}
          size="sm"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center space-x-1">
          {currentPage > 2 && (
            <>
              <Button
                onClick={() => onPageChange(1)}
                size="sm"
                className="w-10"
              >
                {1}
              </Button>
              {currentPage > 3 && <span>...</span>}
            </>
          )}

          {currentPage > 1 && (
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              size="sm"
              className="w-10"
            >
              {currentPage - 1}
            </Button>
          )}

          <Button size="sm" disabled className="w-10">
            {currentPage}
          </Button>

          {currentPage < totalPages && (
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              size="sm"
              className="w-10"
            >
              {currentPage + 1}
            </Button>
          )}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <span>...</span>}
              <Button
                onClick={() => onPageChange(totalPages)}
                size="sm"
                className="w-10"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          size="sm"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </>
  )
}
