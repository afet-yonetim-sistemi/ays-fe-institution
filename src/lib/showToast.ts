import { toast } from '@/hooks/useToast'
import { AxiosError } from 'axios'

export const showErrorToast = (
  error?: AxiosError,
  description: string = 'common.error.defaultDescription'
): void => {
  const title = 'common.error.defaultTitle'

  const status = error?.response?.status

  // error status 401 means session expired in this project 🤷‍♂️. Which we do not want to show toast.
  // Detailed info at https://afetyonetimsistemi.atlassian.net/browse/AYS-878
  if (status === 401) return

  if (status === 429) description = 'common.error.tooManyRequest'

  toast({
    title,
    description,
    variant: 'destructive',
  })
}

export const showSuccessToast = (
  description: string = 'common.success'
): void => {
  const title = 'common.success'

  toast({
    title,
    description,
    variant: 'success',
  })
}
