import { StatusData } from './status'

const filterFields: FilterFields = [
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
