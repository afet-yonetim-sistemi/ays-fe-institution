import { StatusData } from "./status"

const filterFields: FilterFields = [
  {
    label: 'Role Name',
    value: 'roleName',
    placeholder: '',
    type: 'string',
    fieldsType: 'inputField',
  },
  {
    label: 'Role Status',
    value: 'roleStatus',
    options: StatusData.map((status) => ({
      label: status.label,
      value: status.value,
    })),
    fieldsType: 'selectBoxField',
  },
]

export default filterFields
