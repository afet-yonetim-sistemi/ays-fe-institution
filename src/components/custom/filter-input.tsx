import { cn } from '@/shadcn/lib/utils'
import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { t } from 'i18next'
import { memo } from 'react'

interface FilterInputProps {
  id: string
  label: string
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
  value: string | number | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  error?: string | null
  hideNumberSpinner?: boolean
}

const FilterInput: React.FC<FilterInputProps> = memo(
  ({
    id,
    label,
    value,
    onChange,
    onInput,
    placeholder = '',
    type = 'text',
    inputMode,
    maxLength,
    error,
    hideNumberSpinner = false,
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      const char = e.key

      if (
        type === 'number' &&
        !/^\d$/.test(char) &&
        char !== 'Backspace' &&
        char !== 'Delete' &&
        char !== 'ArrowLeft' &&
        char !== 'ArrowRight' &&
        !(e.ctrlKey || e.metaKey) &&
        ['a', 'c', 'v', 'z'].includes(char)
      ) {
        e.preventDefault()
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const newValue = e.target.value

      if (id === 'seatingCount' && type === 'number') {
        const numValue = parseInt(newValue, 10)
        if (newValue && (isNaN(numValue) || numValue < 0 || numValue > 999)) {
          return
        }
      }

      if (id === 'referenceNumber') {
        if (!/^\d*$/.test(newValue) || newValue.length > 10) {
          return
        }
      }

      if (id === 'lineNumber' && !/^\d*$/.test(newValue)) {
        return
      }

      onChange(e)
    }

    const noNumberSpinnerClass =
      'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'

    return (
      <div className="relative">
        <Input
          id={id}
          placeholder={placeholder}
          value={value ?? ''}
          maxLength={maxLength}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type={type}
          onInput={onInput}
          inputMode={inputMode}
          className={cn(
            'peer border-input text-foreground focus:border-primary focus-visible:border-primary block w-full appearance-none rounded-lg border-2 bg-transparent p-3 text-sm focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
            type === 'number' && hideNumberSpinner && noNumberSpinnerClass
          )}
        />
        <Label
          htmlFor={id}
          className="bg-background text-muted-foreground peer-focus:text-primary absolute start-1 top-1.5 !left-3 z-10 origin-[0] -translate-y-4 transform cursor-text rounded text-sm duration-300 peer-placeholder-shown:top-[calc(50%-20px)] peer-placeholder-shown:-translate-y-[calc(50%-10px)] peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          {label}
        </Label>
        <div className="mt-1 h-[16px]">
          {error && (
            <p className="text-destructive text-sm font-medium">{t(error)}</p>
          )}
        </div>
      </div>
    )
  }
)

FilterInput.displayName = 'FilterInput'

export default FilterInput
