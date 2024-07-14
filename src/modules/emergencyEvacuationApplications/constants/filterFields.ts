import { StatusData } from './status'
import { FilterFieldsType } from '@/modules/emergencyEvacuationApplications/constants/types'

const filterFields: FilterFieldsType[] = [
  {
    label: 'Reference Number',
    value: 'referenceNumber',
    placeholder: '',
    type: 'number',
    maxLength: 10,
    fieldsType: 'inputField',
  },
  {
    label: 'seatingCount',
    value: 'seatingCount',
    placeholder: '',
    type: 'number',
    maxLength: 3,
    fieldsType: 'inputField',
  },
  {
    label: 'isInPerson',
    value: 'isInPerson',
    fieldsType: 'quickFilterField',
  },
  {
    label: 'sourceCity',
    value: 'sourceCity',
    placeholder: '',
    fieldsType: 'inputField',
  },
  {
    label: 'sourceDistrict',
    value: 'sourceDistrict',
    placeholder: '',
    fieldsType: 'inputField',
  },
  {
    label: 'targetCity',
    value: 'targetCity',
    placeholder: '',
    fieldsType: 'inputField',
  },
  {
    label: 'targetDistrict',
    value: 'targetDistrict',
    placeholder: '',
    fieldsType: 'inputField',
  },
  {
    label: 'status',
    value: 'status',
    options: StatusData.map((status) => ({
      label: status.label,
      value: status.value,
    })),
    fieldsType: 'selectBoxField',
  },
]

export default filterFields
