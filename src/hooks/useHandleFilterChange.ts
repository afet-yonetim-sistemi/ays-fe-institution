import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export const useHandleFilterChange = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (key: string, value: string | string[]) => {
    const updatedParams = new URLSearchParams(searchParams)
    updatedParams.set('page', '1')
    if (Array.isArray(value)) {
      updatedParams.set(key, value.join(','))
    } else {
      updatedParams.set(key, value)
    }
    router.push(`${pathname}?${updatedParams.toString()}`)
  }
}
