import { StatusData } from './status'

const filterFields: FilterFields = [
  {
    label: 'Reference Number',
    value: 'referenceNumber',
    placeholder: '',
    type: 'number',
    maxLength: 10,
    fieldsType: 'inputField'
  },
  {
    label: 'seatingCount',
    value: 'seatingCount',
    placeholder: '',
    type: 'number',
    maxLength: 3,
    fieldsType: 'inputField'
  },
  {
    label: 'isInPerson',
    value: 'isInPerson',
    fieldsType: 'quickFilterField'
  },
  {
    label: 'status',
    value: 'status',
    options: StatusData.map((status) => ({
      label: status.label,
      value: status.value
    })),
    fieldsType: 'selectBoxField'
  }
]

export default filterFields
