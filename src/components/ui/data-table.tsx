'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalRows: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalRows,
  pageSize,
  currentPage,
  onPageChange,
}: Readonly<DataTableProps<TData, TValue>>): JSX.Element {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = Math.ceil(totalRows / pageSize)

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
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
                    className="bg-secondary text-secondary-foreground font-bold text-left"
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && t('selected')}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('noResult')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end p-4 space-x-2">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
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
          disabled={currentPage === totalPages}
          size="sm"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </>
  )
}
