import { Sort } from '@/common/types'
import DataTableSort from '@/components/ui/data-table-sort'
import Status from '@/components/ui/status'
import { fallbackStatus } from '@/constants/fallBackStatus'
import { formatDateTime } from '@/lib/dataFormatters'
import { getSortState } from '@/lib/getSortState'
import { Column, ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
import {
  adminApplicationRegistrationStatuses,
  AdminRegistrationApplicationStatus,
} from '../constants/statuses'
import { AdminRegistrationApplication } from '../constants/types'

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
      cell: ({ row }): React.ReactNode => (
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
      cell: ({ row }): React.ReactNode => {
        const status =
          adminApplicationRegistrationStatuses.find(
            (status) =>
              status.value ===
              row.getValue<AdminRegistrationApplicationStatus>('status')
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
      cell: ({ row }): string => formatDateTime(row.getValue('createdAt')),
    },
  ]
}
