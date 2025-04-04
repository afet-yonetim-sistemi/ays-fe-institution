import { toast } from '@/hooks/useToast'
import { AxiosError } from 'axios'

export const showErrorToast = (
  error?: AxiosError,
  description: string = 'common.error.defaultDescription'
): void => {
  const title = 'common.error.defaultTitle'

  if (error?.response?.status === 429) {
    description = 'common.error.tooManyRequest'
  }

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
