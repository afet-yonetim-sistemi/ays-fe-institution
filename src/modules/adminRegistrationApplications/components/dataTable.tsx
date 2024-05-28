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
  AdminRegistrationApplication,
  columns,
} from '@/modules/adminRegistrationApplications/components/columns'
import {
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const ListRegistration = ({
  data,
  sorting,
  setSorting,
}: {
  data: AdminRegistrationApplication[]
  sorting?: SortingState
  setSorting: OnChangeFn<SortingState>
}) => {
  const pathname: string = usePathname()
  const router = useRouter()
  const { t } = useTranslation()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    manualSorting: true,
    onSortingChange: setSorting,
  })
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
                  <TableCell key={cell.id}>
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
