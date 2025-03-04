import { useEffect, useState } from 'react'
import { getRoleSummary } from '@/modules/roles/service'
import { handleErrorToast } from '@/lib/handleErrorToast'
import { UserRole } from '@/modules/users/constants/types'

const useFetchRoleSummary = () => {
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
        handleErrorToast(err, { description: 'error.roleSummaryFetch' })
      })
  }, [])

  return roles
}

export default useFetchRoleSummary
