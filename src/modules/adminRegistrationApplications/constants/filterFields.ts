import { StatusData } from './status'

interface FilterFields {
  label: string
  value: string
  type?: string
  placeholder?: string
  options?: { label: string; value: string }[]
  maxLength?: number
  fieldsType?: string
}

const filterFields: FilterFields[] = [
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
