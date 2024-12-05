import { Column, ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
import { formatDateTime } from '@/lib/formatDateTime'
import Status from '@/components/ui/status'
import DataTableSort from '@/components/ui/data-table-sort'
import { Sort } from '@/common/types'
import { roleStatuses } from '../constants/statuses'
import { fallbackStatus } from '@/constants/fallBackStatus'
import { getSortState } from '@/lib/getSortState'

export interface Role {
  id: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

export const columns: (
  filters: { sort: Sort[] },
  onSortClick: (column: Column<Role>) => void
) => ColumnDef<Role>[] = (filters, onSortClick) => {
  return [
    {
      accessorKey: 'name',
      header: () => i18next.t('role.name'),
    },
    {
      accessorKey: 'status',
      header: () => i18next.t('status'),
      cell: ({ row }) => {
        const status =
          roleStatuses.find(
            (status) => status.value === row.getValue<string>('status')
          ) || fallbackStatus
        return <Status status={status} />
      },
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('common.createdAt')}
          sortState={getSortState('createdAt', filters)}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
    {
      accessorKey: 'updatedAt',
      header: () => i18next.t('common.updatedAt'),
      cell: ({ row }) => formatDateTime(row.getValue('updatedAt')),
    },
  ]
}
