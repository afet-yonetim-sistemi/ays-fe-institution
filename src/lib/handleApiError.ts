import { toast } from '@/components/ui/use-toast'
import i18n from '@/i18n'
import { AxiosError } from 'axios'

export const handleApiError = (
  error: AxiosError,
  customMessage?: { title?: string; description?: string }
): void => {
  const { t } = i18n

  let title = customMessage?.title || t('common.error')
  let description = customMessage?.description || t('error.default')

  if (error?.response?.status === 429) {
    title = t('common.error')
    description = t('error.tooManyRequest')
  }

  toast({
    title,
    description,
    variant: 'destructive',
  })
}
