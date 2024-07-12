import React, { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { clsx } from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const QuickFilter = ({ label, value }: { label: string; value: string }) => {
  const [checked, setChecked] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const createQuery = () => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())

    if (checked) {
      newSearchParams.set(value, 'true')
    } else {
      newSearchParams.delete(value)
    }
    return newSearchParams
  }
  useEffect(() => {
    router.push(`${pathname}?${createQuery()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked])

  return (
    <>
      <Label
        htmlFor={value}
        className={clsx(
          'text-sm cursor-pointer bg-zinc-300/20 flex items-center gap-1.5 rounded h-10 px-4 py-2',
          {
            'bg-blue-600/10 text-blue-600': checked,
          },
        )}
      >
        <Checkbox
          className="border-none bg-zinc-300/50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
          checked={checked}
          value={value}
          id={value}
          onClick={() => setChecked(!checked)}
        />
        {label}
      </Label>
    </>
  )
}

export default QuickFilter
