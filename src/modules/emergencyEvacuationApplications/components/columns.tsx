import { ColumnDef } from '@tanstack/table-core'
import { formatDateTime } from '@/lib/formatDateTime'
import i18next from 'i18next'
import Status from './status'
import { EmergencyEvacuationApplicationsTableProps } from '@/modules/emergencyEvacuationApplications/constants/types'
import DataTableSort from '@/components/dataTable/dataTableSort'
import { formatPhoneNumber } from '@/lib/formatPhoneNumber'
import { formatReferenceNumber } from '@/lib/formatReferenceNumber'

export const columns: ColumnDef<EmergencyEvacuationApplicationsTableProps>[] = [
  {
    accessorKey: 'referenceNumber',
    header: () => i18next.t('referenceNumber'),
    cell: ({ row }) => formatReferenceNumber(row.original.referenceNumber),
    size: 145
  },
  {
    accessorKey: 'firstName',
    header: () => i18next.t('firstName'),
    cell: ({ row }) => row.original.firstName,
    size: 170
  },
  {
    accessorKey: 'lastName',
    header: () => i18next.t('lastName'),
    cell: ({ row }) => row.original.lastName,
    size: 170
  },
  {
    accessorKey: 'phoneNumber',
    header: () => i18next.t('phoneNumber'),
    cell: ({ row }) => formatPhoneNumber(row.original.phoneNumber),
    size: 170
  },
  {
    accessorKey: 'isInPerson',
    header: () => i18next.t('isInPerson'),
    cell: ({ row }) => i18next.t(row.original.isInPerson ? 'yes' : 'no'),
    size: 100
  },
  {
    accessorKey: 'seatingCount',
    header: () => i18next.t('seatingCount'),
    cell: ({ row }) => row.original.seatingCount,
    size: 110
  },
  {
    accessorKey: 'status',
    header: () => i18next.t('status'),
    cell: ({ row }) => <Status status={row.getValue('status')} />,
    size: 170
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return <DataTableSort column={column} />
    },
    size: 155,
    cell: ({ row }) => {
      return <div className="px-2">{formatDateTime(row.getValue('createdAt'))}</div>
    }
  }
]
