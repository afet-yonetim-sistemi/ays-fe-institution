'use client'

import { ColumnDef } from '@tanstack/react-table'
import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from './skeleton'
import { useId } from 'react'



interface DataTableSkeletonProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  pageSize: number
}

export function DataTableSkeleton<TData extends { id: string }, TValue>({
  columns,
  pageSize,
}: Readonly<DataTableSkeletonProps<TData, TValue>>): JSX.Element {

  const baseId = useId()

  return (
   
  <>
  
  {Array.from({ length: pageSize }, (_, rowIndex) => (
    
    <TableRow 
    key={`${baseId}-row-${rowIndex}`} 
    aria-hidden="true"
    
    >
      {columns.map((_, colIndex) => {
        return (
          <TableCell key={`${baseId}-col-${colIndex}`}>
            <Skeleton className="h-3 md:h-4 w-full" />
          </TableCell>
        )
      })}
    </TableRow>
  ))}
</>

  )
}