import { ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
import { formatDateTime } from '@/lib/formatDateTime'
import DataTableSort from '@/components/dataTable/dataTableSort'
import { RoleListingTableProps } from '../constants/types';

export const columns: ColumnDef<RoleListingTableProps>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableSort column={column} label={i18next.t('roleName')} />
    ),
    cell: ({ row }) => row.original.name,
    size: 200,
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('roleStatus'),
    cell: ({ row }) => row.original.status,
    size: 100,
  },
  {
    accessorKey: 'createdAt',
    header: () => i18next.t('createdDateTime'),
    cell: ({ row }) => <div className="px-2">{formatDateTime(row.getValue('updatedAt'))}</div>,
    size: 170,
  },
  {
    accessorKey: 'updatedAt',
    header: () => i18next.t('updatedDateTime'),
    cell: ({ row }) => <div className="px-2">{formatDateTime(row.getValue('updatedAt'))}</div>,
    size: 170,
  },
];
