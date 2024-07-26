declare type FilterFields = {
  label: string
  value: string
  type?: string
  placeholder?: string
  options?: { label: string; value: string }[]
  fieldsType?: 'selectBoxField' | 'inputField' | 'quickFilterField'
}[]
