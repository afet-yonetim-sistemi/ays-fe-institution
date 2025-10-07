import { emailRegex, nameRegex } from '@/constants/regex'

export const COMMON_VALIDATION_RULES = {
  NAME: {
    min: 2,
    max: 100,
    regex: nameRegex,
  },
  EMAIL: {
    min: 0,
    max: 254,
    regex: emailRegex,
  },
  CITY: {
    min: 2,
    max: 100,
    regex: nameRegex,
  },
  LOCATION: {
    min: 2,
    max: 100,
    regex: nameRegex,
  },
} as const
