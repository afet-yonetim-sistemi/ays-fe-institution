import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'

export default function ErrorHelper({
  message,
}: {
  message: string
}): JSX.Element {
  const { t } = useTranslation()
  return (
    <Alert variant="destructive" className={'m-5 w-1/3 absolute bg-white z-20'}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t('common.error')}</AlertTitle>
      <AlertDescription>{t(message)}</AlertDescription>
    </Alert>
  )
}
