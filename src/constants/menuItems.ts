import { BusFront, HomeIcon, UserRoundCheck } from 'lucide-react'
import React from 'react'
import { Permission } from '@/constants/permissions'

interface Menu {
  key: string
  label: string
  icon: React.ElementType
  requiredPermissions?: Permission[]
}

export const MenuItems: Menu[] = [
  {
    key: '/dashboard',
    label: 'home',
    icon: HomeIcon,
  },
  {
    key: '/admin-registration-applications',
    label: 'adminRegistrationApplications',
    icon: UserRoundCheck,
    requiredPermissions: [Permission.APPLICATION_LIST],
  },
  {
    key: '/emergency-evacuation-applications',
    label: 'emergencyEvacuationApplications',
    icon: BusFront,
    requiredPermissions: [Permission.EVACUATION_LIST],
  },
  {
    key: '/role-listing',
    label: 'roleListing',
    icon: BusFront,
  },
]
