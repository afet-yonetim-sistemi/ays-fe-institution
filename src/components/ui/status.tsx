import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { LabeledItem } from '@/common/types'

interface StatusProps {
  status: LabeledItem
}

const Status = ({ status }: StatusProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs',
        status.color
      )}
    >
      {t(status.label)}
    </span>
  )
}

export default Status
