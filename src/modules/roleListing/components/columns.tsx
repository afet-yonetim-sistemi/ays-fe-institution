import { ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
import { formatDateTime } from '@/lib/formatDateTime'
import DataTableSort from '@/components/dataTable/dataTableSort'
import { RoleListingTableProps } from '../constants/types'
import Status from './status'

export const columns: ColumnDef<RoleListingTableProps>[] = [
  {
    accessorKey: 'name',
    header: () => i18next.t('name'),
    cell: ({ row }) => row.original.name,
    size: 200,
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('status'),
    cell: ({ row }) => <Status status={row.getValue('status')} />,
    size: 100,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }): JSX.Element => {
      return (
        <DataTableSort column={column} label={i18next.t('createDateTime')} />
      )
    },
    cell: ({ row }): JSX.Element => {
      return (
        <div className="px-2">{formatDateTime(row.getValue('createdAt'))}</div>
      )
    },
    size: 170,
  },
  {
    accessorKey: 'updatedAt',
    header: () => i18next.t('updateDateTime'),
    cell: ({ row }) => (
      <div className="px-2">{formatDateTime(row.getValue('updatedAt'))}</div>
    ),
    size: 170,
  },
]
