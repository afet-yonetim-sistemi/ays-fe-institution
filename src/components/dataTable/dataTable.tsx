'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter } from 'next/navigation'
import React, { CSSProperties } from 'react'
import { LoadingSpinner } from '@/components/ui/loadingSpinner'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import Pagination from '@/components/ui/pagination'

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>
  loading?: boolean
  enableRowClick?: boolean
}
// eslint-disable-next-line
export function ListRegistration<TData>({
  table,
  children,
  className,
  loading,
  enableRowClick,
}: DataTableProps<TData>) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  //eslint-disable-next-line
  const handleRowClick = (row: any): void => {
    if (enableRowClick) {
      router.push(`${pathname}/${row.original.id}`) // Row'daki id alanını kullanarak detay sayfasına yönlendirme
    }
  }

  return (
    <div className={cn('w-full space-y-2.5 overflow-auto', className)}>
      {children}
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
                    header.column.getCanHide() && (
                      <TableHead
                        key={header.id}
                        className="h-10 px-2"
                        style={styles}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <div className="flex items-center h-14 justify-center ">
                    <LoadingSpinner size={34} />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="cursor-pointer">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      cell.column.getCanHide() && (
                        <TableCell
                          key={cell.id}
                          className="px-2 overflow-hidden text-ellipsis"
                          width={cell.column.getSize()}
                          onClick={() => handleRowClick(row)}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24"
                >
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
      {!loading && (
        <div className="float-end">
          <Pagination totalPages={table.getPageCount()} />
        </div>
      )}
    </div>
  )
}

export default ListRegistration
