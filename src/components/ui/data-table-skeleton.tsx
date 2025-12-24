'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Skeleton } from './skeleton'
import { TableCell, TableRow } from './table'

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
                <Skeleton className="h-3 w-full md:h-4" />
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </>
  )
}
