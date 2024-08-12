import { StatusData } from './status'

const filterFields: FilterFields = [
  {
    label: 'Reference Number',
    value: 'referenceNumber',
    placeholder: '',
    type: 'number',
    fieldsType: 'inputField',
  },
  {
    label: 'seatingCount',
    value: 'seatingCount',
    placeholder: '',
    type: 'number',
    fieldsType: 'inputField',
  },
  {
    label: 'isInPerson',
    value: 'isInPerson',
    fieldsType: 'quickFilterField',
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
