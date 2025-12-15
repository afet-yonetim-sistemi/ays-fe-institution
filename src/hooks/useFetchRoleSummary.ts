import { showErrorToast } from '@/lib/showToast'
import { getRoleSummary } from '@/modules/roles/service'
import { UserRole } from '@/modules/users/constants/types'
import { useEffect, useState } from 'react'

const useFetchRoleSummary = () => {
  const [roles, setRoles] = useState<UserRole[]>([])
  const [userRolesIsLoading, setUserRolesIsLoading] = useState(true)

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
      .catch((error) => {
        showErrorToast(error, 'common.error.fetch')
      })
      .finally(() => setUserRolesIsLoading(false))
  }, [])

  return { roles, userRolesIsLoading }
}

export default useFetchRoleSummary
