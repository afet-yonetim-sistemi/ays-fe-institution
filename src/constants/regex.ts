export const emailRegex = new RegExp(
  '^(?!.*\\.{2})(?!.*--)' +
    '\\p{Alnum}[\\p{Alnum}._%+\\-]*@' +
    '(?!-)(?:[\\p{Alnum}-]+(?<!-)\\.)+' +
    '\\p{Alpha}{2,}$'
)
