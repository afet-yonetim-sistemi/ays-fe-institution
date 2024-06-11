'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/table-core'
import { usePathname, useRouter } from 'next/navigation'
import React, { CSSProperties } from 'react'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Inbox } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  setSorting?: OnChangeFn<SortingState>
  sorting?: SortingState
  loading?: boolean
  enableRowClick?: boolean
}

export function ListRegistration<TData, TValue>({
  columns,
  data,
  setSorting,
  sorting,
  loading,
  enableRowClick,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const handleRowClick = (row: any) => {
    if (enableRowClick) {
      router.push(`${pathname}/${row.original.id}`) // Örneğin, row'daki id alanını kullanarak detay sayfasına yönlendirme
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table className="w-full table-fixed text-sm">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/50 divide-x divide-muted-muted/50"
            >
              {headerGroup.headers.map((header) => {
                const styles: CSSProperties =
                  header.getSize() !== 150
                    ? { width: `${header.getSize()}px` }
                    : {}

                return (
                  <TableHead
                    key={header.id}
                    className="h-10 px-2"
                    style={styles}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className="flex items-center h-14 justify-center ">
                  <LoadingSpinner size={34} />
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="cursor-pointer">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-2"
                    width={cell.column.getSize()}
                    onClick={() => handleRowClick(row)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24">
                <div className="flex flex-col items-center">
                  <Inbox strokeWidth={1} size={64} />
                  {t('noResult')}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
export default ListRegistration
