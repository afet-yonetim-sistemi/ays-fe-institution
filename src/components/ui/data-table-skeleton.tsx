'use client'

import { ColumnDef } from '@tanstack/react-table'
import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from './skeleton'

interface DataTableSkeletonProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  pageSize: number
}

export function DataTableSkeleton<TData extends { id: string }, TValue>({
  columns,
  pageSize,
}: Readonly<DataTableSkeletonProps<TData, TValue>>): JSX.Element {
  return (
    <>
      {Array.from({ length: pageSize }, (_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`} aria-hidden="true">
          {columns.map((_, colIndex) => {
            return (
              <TableCell key={`skeleton-row-${rowIndex}-col-${colIndex}`}>
                <Skeleton className="h-3 md:h-4 w-full" />
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </>
  )
}
