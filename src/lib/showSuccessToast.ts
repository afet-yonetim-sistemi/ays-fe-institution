import { toast } from '@/hooks/useToast'

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
