import { HomeIcon, UserRoundCheck } from 'lucide-react'
import React from 'react'

interface Menu {
  key: string
  label: string
  icon: React.ElementType
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
  },
]
