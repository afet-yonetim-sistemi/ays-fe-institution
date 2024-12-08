import { LabeledItem } from '@/common/types'

export const userStatuses: LabeledItem[] = [
  { label: 'active', value: 'ACTIVE', color: 'bg-green-500 text-white' },
  { label: 'passive', value: 'PASSIVE', color: 'bg-yellow-500 text-white' },
  { label: 'deleted', value: 'DELETED', color: 'bg-red-500 text-white' },
  {
    label: 'notVerified',
    value: 'NOT_VERIFIED',
    color: 'bg-blue-500 text-white',
  },
]
