import { cn } from '@/lib/utils'
import { t } from 'i18next'
import { memo } from 'react'
import { Input } from './input'
import { Label } from './label'

interface FilterInputProps {
  id: string
  label: string
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
            'peer block w-full appearance-none rounded-lg border-[2px] border-gray-200 bg-transparent p-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500',
            type === 'number' && hideNumberSpinner && noNumberSpinnerClass
          )}
        />
        <Label
          htmlFor={id}
          className="absolute !left-3 start-1 top-1.5 z-10 origin-[0] -translate-y-4 transform cursor-text rounded bg-white text-sm text-gray-500 duration-300 peer-placeholder-shown:top-[calc(50%-20px)] peer-placeholder-shown:-translate-y-[calc(50%-10px)] peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:text-blue-600 dark:bg-background dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          {label}
        </Label>
        <div className="mt-1 h-[16px]">
          {error && (
            <p className="text-sm font-medium text-destructive">{t(error)}</p>
          )}
        </div>
      </div>
    )
  }
)

FilterInput.displayName = 'FilterInput'

export { FilterInput }
export default FilterInput
