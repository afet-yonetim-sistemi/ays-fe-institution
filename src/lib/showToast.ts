import { AxiosError } from 'axios'
import i18next from 'i18next'
import { toast } from 'sonner'

interface ErrorToastOptions {
  show401?: boolean
}

export const showErrorToast = (
  error?: AxiosError,
  descriptionKey: string = 'common.error.defaultDescription',
  options: ErrorToastOptions = {}
): void => {
  const { show401 = false } = options
  const titleKey = 'common.error.defaultTitle'
  const responseStatus = error?.response?.status

  if (responseStatus === 401 && !show401) return

  let finalDescriptionKey = descriptionKey
  if (responseStatus === 429) {
    finalDescriptionKey = 'common.error.tooManyRequest'
  }

  toast.error(i18next.t(titleKey), {
    description: i18next.t(finalDescriptionKey),
  })
}

export const showSuccessToast = (
  descriptionKey: string = 'common.success'
): void => {
  const titleKey = 'common.success'

  toast.success(i18next.t(titleKey), {
    description: i18next.t(descriptionKey),
  })
}
