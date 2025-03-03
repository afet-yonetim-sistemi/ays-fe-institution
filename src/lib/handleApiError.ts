import { toast } from '@/components/ui/use-toast'
import { AxiosError } from 'axios'

export const handleApiError = (
  error?: AxiosError,
  customMessage?: { title?: string; description?: string }
): void => {
  let title = customMessage?.title ?? 'common.error'
  let description = customMessage?.description ?? 'error.default'

  if (error?.response?.status === 429) {
    title = 'common.error'
    description = 'error.tooManyRequest'
  }

  toast({
    title,
    description,
    variant: 'destructive',
  })
}
