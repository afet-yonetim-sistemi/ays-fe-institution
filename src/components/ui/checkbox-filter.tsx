'use client'

import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Checkbox } from './checkbox'
import { Label } from './label'

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
        'flex h-10 cursor-pointer items-center gap-1.5 rounded bg-zinc-300/20 px-4 py-2 text-sm',
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

export { CheckboxFilter }
