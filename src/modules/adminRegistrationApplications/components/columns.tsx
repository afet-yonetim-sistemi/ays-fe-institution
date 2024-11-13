import { ColumnDef, Column } from '@tanstack/table-core'
import { formatDateTime } from '@/lib/formatDateTime'
import i18next from 'i18next'
import { Institution } from '@/common/types'
import Status from '@/components/ui/status'
import DataTableSort from '@/components/ui/data-table-sort'

export interface AdminRegistrationApplication {
  id: string
  reason: string
  status: string
  institution: Institution
  createdUser: string
  createdAt: string
}

export const columns: (
  onSortClick: (column: Column<AdminRegistrationApplication>) => void
) => ColumnDef<AdminRegistrationApplication>[] = (onSortClick) => [
  {
    accessorKey: 'institution.name',
    header: () => i18next.t('institution'),
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '400px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        title={row.original.reason}
      >
        {row.original.reason}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('status'),
    cell: ({ row }) => <Status status={row.getValue('status')} />,
    size: 100,
  },
  {
    accessorKey: 'createdUser',
    header: () => i18next.t('createdUser'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableSort
        column={column}
        label={i18next.t('createdAt')}
        onSortClick={onSortClick}
      />
    ),
    cell: ({ row }) => (
      <div className="px-2">{formatDateTime(row.getValue('createdAt'))}</div>
    ),
  },
]
