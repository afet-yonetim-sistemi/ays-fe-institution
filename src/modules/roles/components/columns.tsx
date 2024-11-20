import { Column, ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
import { formatDateTime } from '@/lib/formatDateTime'
import Status from '@/components/ui/status'
import DataTableSort from '@/components/ui/data-table-sort'
import { Sort } from '@/common/types'

export interface Role {
  id: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

export const columns: (
  filters: { sort: Sort | undefined },
  onSortClick: (column: Column<Role>) => void
) => ColumnDef<Role>[] = (filters, onSortClick) => {
  const sortState = filters.sort || { column: '', direction: undefined }

  return [
    {
      accessorKey: 'name',
      header: () => i18next.t('role.name'),
    },
    {
      accessorKey: 'status',
      header: () => i18next.t('status'),
      cell: ({ row }) => <Status status={row.getValue('status')} />,
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableSort
          column={column}
          label={i18next.t('common.createdAt')}
          sortState={sortState}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => (
        <div className="px-2">{formatDateTime(row.getValue('createdAt'))}</div>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: () => i18next.t('common.updatedAt'),
      cell: ({ row }) => (
        <div className="px-2">{formatDateTime(row.getValue('updatedAt'))}</div>
      ),
    },
  ]
}
