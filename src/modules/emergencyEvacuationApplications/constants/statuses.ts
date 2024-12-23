import { LabeledItem } from '@/common/types'

export const emergencyEvacuationApplicationStatuses: LabeledItem[] = [
  { label: 'pending', value: 'PENDING', color: 'bg-gray-500 text-white' },
  { label: 'inReview', value: 'IN_REVIEW', color: 'bg-teal-500 text-white' },
  {
    label: 'receivedFirstApprove',
    value: 'RECEIVED_FIRST_APPROVE',
    color: 'bg-blue-500 text-white',
  },
  {
    label: 'receivedSecondApprove',
    value: 'RECEIVED_SECOND_APPROVE',
    color: 'bg-blue-600 text-white',
  },
  {
    label: 'receivedThirdApprove',
    value: 'RECEIVED_THIRD_APPROVE',
    color: 'bg-blue-700 text-white',
  },
  { label: 'completed', value: 'COMPLETED', color: 'bg-green-500 text-white' },
  { label: 'cancelled', value: 'CANCELLED', color: 'bg-red-500 text-white' },
]
