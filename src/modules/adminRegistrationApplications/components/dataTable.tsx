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
import { AdminRegistrationApplication } from '@/modules/adminRegistrationApplications/components/columns'

interface DataTableProps {
  columns: ColumnDef<AdminRegistrationApplication>[]
  data: AdminRegistrationApplication[]
  setSorting?: OnChangeFn<SortingState>
  sorting?: SortingState
}

export function ListRegistration({
  columns,
  data,
  setSorting,
  sorting,
}: DataTableProps) {
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
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className="rounded-md border">
      <Table className="w-full caption-bottom text-sm">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-muted/0">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="h-10 px-2">
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() => router.push(`${pathname}/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-2"
                    width={cell.column.getSize()}
                    colSpan={1}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t('noResult')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
export default ListRegistration
