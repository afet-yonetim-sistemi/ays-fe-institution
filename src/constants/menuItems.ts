import {
  BusFront,
  HomeIcon,
  UserRoundCheck,
  ClipboardPenLine,
  Users,
} from 'lucide-react'
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
    label: 'adminRegistrationApplications.title',
    icon: UserRoundCheck,
    requiredPermissions: [Permission.APPLICATION_LIST],
  },
  {
    key: '/emergency-evacuation-applications',
    label: 'emergencyEvacuationApplications.title',
    icon: BusFront,
    requiredPermissions: [Permission.EVACUATION_LIST],
  },
  {
    key: '/roles',
    label: 'roles',
    icon: ClipboardPenLine,
    requiredPermissions: [Permission.ROLE_LIST],
  },
  {
    key: '/users',
    label: 'user.title',
    icon: Users,
    requiredPermissions: [Permission.USER_LIST],
  },
]
