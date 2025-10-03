export const COMMON_VALIDATION_RULES = {
  NAME: {
    min: 2,
    max: 100,
    regex: /^(?!\d+$)[\p{L}\d\p{P} ]+$/u,
  },
  EMAIL: {
    min: 0,
    max: 254,
  },
  CITY: {
    min: 2,
    max: 100,
    regex: /^(?!\d+$)[\p{L}\d\p{P} ]+$/u,
  },
  LOCATION: {
    min: 2,
    max: 100,
    regex: /^(?!\d+$)[\p{L}\d\p{P} ]+$/u,
  },
} as const
