import { BaseApiResponse } from '@/common/types'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface UseCreatePageOptions<TPayload> {
  createItem: (payload: TPayload) => Promise<BaseApiResponse>
  redirectPath: string
  successMessage?: string
  errorMessage?: string
}

interface UseCreatePageReturn<TPayload> {
  handleCreate: (payload: TPayload) => Promise<void>
  isCreating: boolean
}

export function useCreatePage<TPayload>({
  createItem,
  redirectPath,
  successMessage = 'common.createSuccess',
  errorMessage = 'common.createError',
}: UseCreatePageOptions<TPayload>): UseCreatePageReturn<TPayload> {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = useCallback(
    async (payload: TPayload): Promise<void> => {
      setIsCreating(true)
      try {
        await createItem(payload)
        showSuccessToast(successMessage)
        router.push(redirectPath)
      } catch (error) {
        showErrorToast(
          error instanceof AxiosError ? error : undefined,
          errorMessage
        )
      } finally {
        setIsCreating(false)
      }
    },
    [createItem, redirectPath, successMessage, errorMessage, router]
  )

  return {
    handleCreate,
    isCreating,
  }
}
