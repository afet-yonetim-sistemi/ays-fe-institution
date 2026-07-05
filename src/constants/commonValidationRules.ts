import {
  emailFormRegex,
  nameFilterRegex,
  nameFormRegex,
  numericRegex,
  roleFilterRegex,
  roleFormRegex,
} from '@/constants/regex'

export const COMMON_VALIDATION_RULES = {
  NAME: {
    min: 2,
    max: 100,
    formRegex: nameFormRegex,
    filterRegex: nameFilterRegex,
  },
  EMAIL: {
    min: 6,
    max: 254,
    formRegex: emailFormRegex,
  },
  CITY: {
    min: 2,
    max: 100,
    formRegex: nameFormRegex,
    filterRegex: nameFilterRegex,
  },
  DISTRICT: {
    min: 2,
    max: 100,
    formRegex: nameFormRegex,
    filterRegex: nameFilterRegex,
  },
  LOCATION: {
    min: 2,
    max: 100,
    formRegex: nameFormRegex,
    filterRegex: nameFilterRegex,
  },
  ROLE: {
    min: 2,
    max: 255,
    formRegex: roleFormRegex,
    filterRegex: roleFilterRegex,
  },
  NUMERIC: {
    formRegex: numericRegex,
    filterRegex: numericRegex,
  },
} as const
