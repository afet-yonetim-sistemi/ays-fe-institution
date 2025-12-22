'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { showErrorToast } from '@/lib/showToast'
import { selectRefreshToken, selectUser } from '@/modules/auth/authSlice'
import type { UserInfo } from '@/modules/auth/constants/types'
import authService from '@/modules/auth/service'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { LuUser } from 'react-icons/lu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import LanguageToggle from './languageToggle'
import Menu from './menu'
import { ModeToggle } from './modeToggle'

interface UserInfoProps {
  userInfo?: UserInfo | null
  className?: string
}

const UserInfoDisplay: React.FC<UserInfoProps> = ({ userInfo, className }) => {
  const isDropdown = className === 'grid'
  return (
    <div className={className || 'hidden sm:grid'}>
      <span
        className={`text-sm font-bold ${isDropdown ? 'text-left' : 'flex justify-end'}`}
      >
        {userInfo?.userFirstName} {userInfo?.userLastName}
      </span>
      <span className={'text-sm'}>{userInfo?.institutionName}</span>
    </div>
  )
}

function Navbar(): JSX.Element {
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
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
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
        <div className="flex w-full flex-1 items-center space-x-2">
          <Image
            src="/aysLogo40px.svg"
            alt="AYS Logo"
            width={40}
            height={40}
            priority
            unoptimized
          />
          <div className="hidden text-center md:block md:text-left">
            {t('common.AYS')}
          </div>
        </div>
      </Link>
      <div className="flex space-x-2">
        <LanguageToggle />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={'flex cursor-pointer'}>
              <UserInfoDisplay userInfo={userInfo} />
              <Avatar className={'float-right ml-3'}>
                <AvatarFallback>
                  <LuUser size={22} />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem disabled className={'block sm:hidden'}>
              <UserInfoDisplay userInfo={userInfo} className="grid" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logout()}>
              {t('navBar.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Navbar
