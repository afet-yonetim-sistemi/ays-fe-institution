'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface CheckboxFilterProps {
  label: string
  isChecked: boolean
  onChange: (checked: boolean) => void
}

const CheckboxFilter = ({
  label,
  isChecked,
  onChange,
}: CheckboxFilterProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Label
      htmlFor={label}
      className={clsx(
        'text-sm cursor-pointer bg-zinc-300/20 flex items-center gap-1.5 rounded h-10 px-4 py-2',
        {
          'bg-blue-600/10 text-blue-600': isChecked,
        }
      )}
    >
      <Checkbox
        id={label}
        className="border-none bg-zinc-300/50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
        checked={isChecked}
        onCheckedChange={(event) => onChange(!!event)}
      />
      {t(label)}
    </Label>
  )
}

export default CheckboxFilter
