import { toast } from '@/hooks/useToast'
import { AxiosError } from 'axios'

export const handleErrorToast = (
  error?: AxiosError,
  customMessage?: { title?: string; description?: string }
): void => {
  const title = customMessage?.title ?? 'common.error.defaultTitle'
  let description =
    customMessage?.description ?? 'common.error.defaultDescription'

  if (error?.response?.status === 429) {
    description = 'common.error.tooManyRequest'
  }

  toast({
    title,
    description,
    variant: 'destructive',
  })
}
