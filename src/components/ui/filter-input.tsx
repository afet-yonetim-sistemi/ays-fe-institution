import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { t } from 'i18next'
import { memo } from 'react'

interface FilterInputProps {
  id: string
  label: string
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
    placeholder = '',
    type = 'text',
    error,
    hideNumberSpinner = false,
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type={type}
          className={cn(
            'block focus-visible:ring-0 focus-visible:ring-offset-0 p-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-[2px] border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer',
            type === 'number' && hideNumberSpinner && noNumberSpinnerClass
          )}
        />
        <Label
          htmlFor={id}
          className="absolute !left-3 rounded cursor-text text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 top-1.5 z-10 origin-[0] bg-white dark:bg-background peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[calc(50%-10px)] peer-placeholder-shown:top-[calc(50%-20px)] peer-focus:top-1.5 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {label}
        </Label>
        <div className="h-[16px] mt-1">
          {error && (
            <p className="text-sm font-medium text-destructive">{t(error)}</p>
          )}
        </div>
      </div>
    )
  }
)

FilterInput.displayName = 'FilterInput'

export default FilterInput
