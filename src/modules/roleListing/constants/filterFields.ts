import { StatusData } from "./status"

const filterFields: FilterFields = [
  {
    label: 'Role Name',
    value: 'name',
    placeholder: '',
    type: 'string',
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
