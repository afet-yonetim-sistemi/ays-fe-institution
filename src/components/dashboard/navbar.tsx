'use client'

import { showErrorToast } from '@/lib/showToast'
import { selectRefreshToken, selectUser } from '@/modules/auth/authSlice'
import type { UserInfo } from '@/modules/auth/constants/types'
import authService from '@/modules/auth/service'
import { Button } from '@/shadcn/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shadcn/ui/sheet'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { LogOut, MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './languageToggle'
import Menu from './menu'
import { ModeToggle } from './modeToggle'

interface UserInfoProps {
  userInfo?: UserInfo | null
}

const UserInfoDisplay: React.FC<UserInfoProps> = ({ userInfo }) => {
  return (
    <div className="hidden sm:grid">
      <span className="flex text-sm font-bold">
        {userInfo?.userFirstName} {userInfo?.userLastName}
      </span>
      <span className={'text-sm'}>{userInfo?.institutionName}</span>
    </div>
  )
}

function Navbar(): React.ReactNode {
  const { t } = useTranslation()
  const userInfo = useAppSelector(selectUser)
  const refreshToken = useAppSelector(selectRefreshToken)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const logout = (): void => {
    authService
      .logout(refreshToken)
      .then(() => {
        dispatch({ type: 'auth/logout' })
        router.push('/login')
      })
      .catch((error) => {
        showErrorToast(error)
      })
  }

  return (
    <header className="bg-muted/40 flex h-14 items-center justify-between gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">{t('navBar.toggle')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex flex-col overflow-auto p-2 pt-12"
          >
            <Menu />
          </SheetContent>
        </Sheet>
        <Link href={'/'}>
          <div className="flex items-center space-x-2">
            <Image
              src="/aysLogo40px.svg"
              alt="AYS Logo"
              width={40}
              height={40}
              priority
              unoptimized
            />
            <UserInfoDisplay userInfo={userInfo} />
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <LanguageToggle />
        <Button variant="destructive" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">
            {t('navBar.secureLogout')}
          </span>
        </Button>
      </div>
    </header>
  )
}

export default Navbar
