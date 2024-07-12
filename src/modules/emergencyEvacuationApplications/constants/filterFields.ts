import { StatusData } from './status'
import { FilterFieldsType } from '@/modules/emergencyEvacuationApplications/constants/types'

const filterFields: FilterFieldsType[] = [
  {
    label: 'Reference Number',
    value: 'referenceNumber',
    placeholder: '',
    maxLength: 10,
  },
  {
    label: 'seatingCount',
    value: 'seatingCount',
    placeholder: '',
    maxLength: 3,
  },
  {
    label: 'sourceCity',
    value: 'sourceCity',
    placeholder: '',
  },
  {
    label: 'sourceDistrict',
    value: 'sourceDistrict',
    placeholder: '',
  },
  {
    label: 'targetCity',
    value: 'targetCity',
    placeholder: '',
  },
  {
    label: 'targetDistrict',
    value: 'targetDistrict',
    placeholder: '',
  },
  {
    label: 'status',
    value: 'status',
    options: StatusData.map((status) => ({
      label: status.label,
      value: status.value,
    })),
  },
]

export default filterFields
