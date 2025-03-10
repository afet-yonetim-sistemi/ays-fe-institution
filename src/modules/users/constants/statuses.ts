import { LabeledItem } from '@/common/types'

export const userStatuses: LabeledItem[] = [
  { label: 'status.active', value: 'ACTIVE', color: 'bg-green-500 text-white' },
  {
    label: 'status.passive',
    value: 'PASSIVE',
    color: 'bg-yellow-500 text-white',
  },
  { label: 'status.deleted', value: 'DELETED', color: 'bg-red-500 text-white' },
  {
    label: 'status.notVerified',
    value: 'NOT_VERIFIED',
    color: 'bg-blue-500 text-white',
  },
]
