import { ColumnDef } from '@tanstack/table-core'
import i18next from 'i18next'
import { formatDateTime } from '@/lib/formatDateTime'
import DataTableSort from '@/components/dataTable/dataTableSort'

export const columns: ColumnDef<RoleManagementTableProps>[] = [
  {
    accessorKey: 'name',
    header: () => i18next.t('roleName'),
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
    header: ({ column }) => <DataTableSort column={column} />,
    cell: ({ row }) => <div className="px-2">{formatDateTime(row.getValue('createdAt'))}</div>,
    size: 170,
  },
  {
    accessorKey: 'updatedAt',
    header: () => i18next.t('updatedAt'),
    cell: ({ row }) => <div className="px-2">{formatDateTime(row.getValue('updatedAt'))}</div>,
    size: 170,
  },
];
