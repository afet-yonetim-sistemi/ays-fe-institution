import { StatusData } from './status'

interface FilterFields {
  label: string
  value: string
  options?: { label: string; value: string }[]
  placeholder?: string
}

const filterFields: FilterFields[] = [
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
