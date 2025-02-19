import { useEffect, useState } from 'react'
import { getRoleSummary } from '@/modules/roles/service'
import { handleApiError } from '@/lib/handleApiError'
import { useTranslation } from 'react-i18next'
import { UserRole } from '@/modules/users/constants/types'

const useFetchRoleSummary = () => {
  const { t } = useTranslation()
  const [roles, setRoles] = useState<UserRole[]>([])

  useEffect(() => {
    getRoleSummary()
      .then((response) => {
        const availableRoles = response.response.map((role: UserRole) => ({
          id: role.id,
          name: role.name,
          isActive: false,
        }))
        setRoles(availableRoles)
      })
      .catch((err) => {
        handleApiError(err, { description: t('error.roleSummaryFetch') })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return roles
}

export default useFetchRoleSummary
