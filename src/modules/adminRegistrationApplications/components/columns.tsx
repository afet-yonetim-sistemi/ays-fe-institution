import { ColumnDef, Column } from '@tanstack/table-core'
import { formatDateTime } from '@/lib/formatDateTime'
import i18next from 'i18next'
import { Institution, Sort } from '@/common/types'
import Status from '@/components/ui/status'
import DataTableSort from '@/components/ui/data-table-sort'
import { adminApplicationRegistrationStatuses } from '../constants/statuses'
import { fallbackStatus } from '@/constants/fallBackStatus'

export interface AdminRegistrationApplication {
  id: string
  reason: string
  status: string
  institution: Institution
  createdUser: string
  createdAt: string
}

export const columns: (
  filters: { sort: Sort | undefined },
  onSortClick: (column: Column<AdminRegistrationApplication>) => void
) => ColumnDef<AdminRegistrationApplication>[] = (filters, onSortClick) => {
  const sortState = filters.sort || { column: '', direction: undefined }

  return [
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
      cell: ({ row }) => {
        const status =
          adminApplicationRegistrationStatuses.find(
            (status) => status.value === row.getValue<string>('status')
          ) || fallbackStatus
        return <Status status={status} />
      },
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
          label={i18next.t('common.createdAt')}
          sortState={sortState}
          onSortClick={onSortClick}
        />
      ),
      cell: ({ row }) => formatDateTime(row.getValue('createdAt')),
    },
  ]
}
