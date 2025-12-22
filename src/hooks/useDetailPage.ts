import { BaseApiResponse } from '@/common/types'
import { showErrorToast, showSuccessToast } from '@/lib/showToast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface UseDetailPageOptions<TDetail, TPayload> {
  fetchDetail: (id: string) => Promise<{ response: TDetail }>
  updateItem: (id: string, payload: TPayload) => Promise<BaseApiResponse>
  deleteItem?: (id: string) => Promise<BaseApiResponse>
  redirectPath?: string
  autoRefreshAfterUpdate?: boolean
  statusOperations?: {
    activate?: {
      handler: (id: string) => Promise<BaseApiResponse>
      successStatus: string | ((currentDetail: TDetail) => TDetail)
      successMessage?: string
    }
    deactivate?: {
      handler: (id: string) => Promise<BaseApiResponse>
      successStatus: string | ((currentDetail: TDetail) => TDetail)
      successMessage?: string
    }
  }
  onSuccess?: {
    update?: (updatedData: TDetail) => void
    activate?: (updatedData: TDetail) => void
    deactivate?: (updatedData: TDetail) => void
    delete?: () => void
  }
  successMessages?: {
    update?: string
    activate?: string
    deactivate?: string
    delete?: string
  }
  errorMessages?: {
    update?: string
    activate?: string
    deactivate?: string
    delete?: string
    fetch?: string
  }
}

interface UseDetailPageReturn<TDetail> {
  detail: TDetail | null
  isLoading: boolean
  error: string | null
  isEditable: boolean
  setIsEditable: (value: boolean) => void
  fetchDetails: (id: string) => Promise<void>
  handleUpdate: (id: string, payload: unknown) => Promise<void>
  statusOperations: {
    activate?: (id: string) => Promise<void>
    deactivate?: (id: string) => Promise<void>
  }
  handleDelete: (id: string) => Promise<void>
  handleCancel: () => void
}

export function useDetailPage<TDetail, TPayload>({
  fetchDetail,
  updateItem,
  deleteItem,
  redirectPath,
  autoRefreshAfterUpdate = false,
  statusOperations,
  onSuccess = {},
  successMessages = {},
  errorMessages = {},
}: UseDetailPageOptions<TDetail, TPayload>): UseDetailPageReturn<TDetail> {
  const router = useRouter()
  const [detail, setDetail] = useState<TDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditable, setIsEditable] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)

  const fetchDetails = useCallback(
    async (id: string): Promise<void> => {
      setCurrentId(id)
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetchDetail(id)
        setDetail(response.response)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Bilinmeyen hata'
        setError(errorMessage)
        showErrorToast(
          err instanceof AxiosError ? err : undefined,
          errorMessages.fetch || 'common.error.fetch'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [fetchDetail, errorMessages.fetch]
  )

  const handleUpdate = useCallback(
    async (id: string, payload: unknown): Promise<void> => {
      try {
        const response = await updateItem(id, payload as TPayload)
        if (response.isSuccess) {
          const updatedDetail = {
            ...detail!,
            ...(payload as Partial<TDetail>),
          } as TDetail
          setDetail(updatedDetail)

          if (onSuccess.update) {
            onSuccess.update(updatedDetail)
          }

          if (autoRefreshAfterUpdate && currentId) {
            await fetchDetails(currentId)
          }

          showSuccessToast(successMessages.update || 'common.updateSuccess')
          setIsEditable(false)
        } else {
          showErrorToast(
            undefined,
            errorMessages.update || 'common.updateError'
          )
        }
      } catch (err) {
        showErrorToast(
          err instanceof AxiosError ? err : undefined,
          errorMessages.update || 'common.updateError'
        )
      }
    },
    [
      detail,
      updateItem,
      onSuccess,
      autoRefreshAfterUpdate,
      currentId,
      fetchDetails,
      successMessages.update,
      errorMessages.update,
    ]
  )

  const handleActivate = useCallback(
    async (id: string): Promise<void> => {
      const activateConfig = statusOperations?.activate
      if (!activateConfig?.handler) return

      try {
        const response = await activateConfig.handler(id)
        if (response.isSuccess) {
          let updatedDetail: TDetail

          if (typeof activateConfig.successStatus === 'function') {
            updatedDetail = activateConfig.successStatus(detail!)
          } else {
            updatedDetail = {
              ...detail!,
              status: activateConfig.successStatus,
            } as TDetail
          }

          setDetail(updatedDetail)

          if (onSuccess.activate) {
            onSuccess.activate(updatedDetail)
          }

          const message =
            activateConfig.successMessage ||
            successMessages.activate ||
            'common.activateSuccess'
          showSuccessToast(message)
        } else {
          showErrorToast()
        }
      } catch (err) {
        showErrorToast(err instanceof AxiosError ? err : undefined)
      }
    },
    [detail, statusOperations, onSuccess, successMessages.activate]
  )

  const handleDeactivate = useCallback(
    async (id: string): Promise<void> => {
      const deactivateConfig = statusOperations?.deactivate
      if (!deactivateConfig?.handler) return

      try {
        const response = await deactivateConfig.handler(id)
        if (response.isSuccess) {
          let updatedDetail: TDetail

          if (typeof deactivateConfig.successStatus === 'function') {
            updatedDetail = deactivateConfig.successStatus(detail!)
          } else {
            updatedDetail = {
              ...detail!,
              status: deactivateConfig.successStatus,
            } as TDetail
          }

          setDetail(updatedDetail)

          if (onSuccess.deactivate) {
            onSuccess.deactivate(updatedDetail)
          }

          const message =
            deactivateConfig.successMessage ||
            successMessages.deactivate ||
            'common.deactivateSuccess'
          showSuccessToast(message)
        } else {
          showErrorToast()
        }
      } catch (err) {
        showErrorToast(err instanceof AxiosError ? err : undefined)
      }
    },
    [detail, statusOperations, onSuccess, successMessages.deactivate]
  )

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      if (!deleteItem) return
      try {
        const response = await deleteItem(id)
        if (response.isSuccess) {
          if (onSuccess.delete) {
            onSuccess.delete()
          } else if (redirectPath) {
            router.push(redirectPath)
          }
          showSuccessToast(successMessages.delete || 'common.deleteSuccess')
        } else {
          showErrorToast()
        }
      } catch (err) {
        showErrorToast(err instanceof AxiosError ? err : undefined)
      }
    },
    [deleteItem, onSuccess, redirectPath, router, successMessages.delete]
  )

  const handleCancel = useCallback((): void => {
    setIsEditable(false)
  }, [])

  return {
    detail,
    isLoading,
    error,
    isEditable,
    setIsEditable,
    fetchDetails,
    handleUpdate,
    statusOperations: {
      activate: statusOperations?.activate ? handleActivate : undefined,
      deactivate: statusOperations?.deactivate ? handleDeactivate : undefined,
    },
    handleDelete,
    handleCancel,
  }
}
