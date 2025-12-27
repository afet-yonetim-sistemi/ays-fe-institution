import { toast } from '@/hooks/useToast'
import { AxiosError } from 'axios'

interface ErrorToastOptions {
  show401?: boolean
}

export const showErrorToast = (
  error?: AxiosError,
  description: string = 'common.error.defaultDescription',
  options: ErrorToastOptions = {}
): void => {
  const { show401 = false } = options
  const title = 'common.error.defaultTitle'
  const responseStatus = error?.response?.status

  if (responseStatus === 401 && !show401) return

  if (responseStatus === 429) {
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
