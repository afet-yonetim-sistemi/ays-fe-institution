import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface UseRoleSelectionOptions {
  minRoles?: number
  errorMessage?: string
  initialRoles?: string[]
}

interface UseRoleSelectionReturn {
  selectedRoles: string[]
  roleError: string | null
  handleRoleToggle: (id: string) => void
  setSelectedRoles: (roles: string[]) => void
}

export function useRoleSelection({
  minRoles = 1,
  errorMessage = 'role.minError',
  initialRoles = [],
}: UseRoleSelectionOptions = {}): UseRoleSelectionReturn {
  const { t } = useTranslation()
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles)

  const roleError = selectedRoles.length < minRoles ? t(errorMessage) : null

  const handleRoleToggle = useCallback((id: string): void => {
    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(id)) {
        return prevSelectedRoles.filter((roleId) => roleId !== id)
      }
      return [...prevSelectedRoles, id]
    })
  }, [])

  return {
    selectedRoles,
    roleError,
    handleRoleToggle,
    setSelectedRoles,
  }
}
