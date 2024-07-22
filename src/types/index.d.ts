declare type FilterFields = {
  label: string
  value: string
  type?: string
  placeholder?: string
  options?: { label: string; value: string }[]
  maxLength?: number
  fieldsType?: 'selectBoxField' | 'inputField' | 'quickFilterField'
}[]