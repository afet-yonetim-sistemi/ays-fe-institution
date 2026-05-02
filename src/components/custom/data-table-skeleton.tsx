'use client'

import { Skeleton } from '@/shadcn/ui/skeleton'
import { TableCell, TableRow } from '@/shadcn/ui/table'
import { ColumnDef } from '@tanstack/react-table'
import * as React from 'react'

interface DataTableSkeletonProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  pageSize: number
}

export function DataTableSkeleton<TData extends { id: string }, TValue>({
  columns,
  pageSize,
}: Readonly<DataTableSkeletonProps<TData, TValue>>): React.ReactNode {
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
