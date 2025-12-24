import { Institution, Sort } from '@/common/types'
import { DataTableSort, Status } from '@/components/ui'
import { fallbackStatus } from '@/constants/fallBackStatus'
import { formatDateTime } from '@/lib/dataFormatters'
import { getSortState } from '@/lib/getSortState'
import { Column, ColumnDef } from '@tanstack/react-table'
import i18next from 'i18next'
import { adminApplicationRegistrationStatuses } from '../constants/statuses'

export interface AdminRegistrationApplication {
  id: string
  reason: string
  status: string
  institution: Institution
  createdUser: string
  createdAt: string
}

export const columns: (
  filters: { sort: Sort[] },
  onSortClick: (column: Column<AdminRegistrationApplication>) => void
) => ColumnDef<AdminRegistrationApplication>[] = (filters, onSortClick) => {
  return [
    {
      accessorKey: 'institution.name',
      header: () => i18next.t('common.institution'),
    },
    {
      accessorKey: 'reason',
      header: () => i18next.t('application.reason'),
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
      header: () => i18next.t('status.title'),
      cell: ({ row }): JSX.Element => {
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
      header: () => i18next.t('common.createdUser'),
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
  ]
}
