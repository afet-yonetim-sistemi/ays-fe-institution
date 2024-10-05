'use client'

import React from 'react'
import { Button } from '../ui/button'
import Menu from './menu'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { ModeToggle } from './modeToggle'
import LanguageToggle from './languageToggle'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { LuUser2 } from 'react-icons/lu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectRefreshToken, selectToken } from '@/modules/auth/authSlice'
import { parseJwt } from '@/lib/helpers'
import authService from '@/modules/auth/service'
import { useRouter } from 'next/navigation'
import { handleApiError } from '@/lib/handleApiError'

function Navbar(): JSX.Element {
  const { t } = useTranslation()
  const token = useAppSelector(selectToken)
  const refreshToken = useAppSelector(selectRefreshToken)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const userInfo = parseJwt(token)

  const logout = (): void => {
    authService
      .logout(refreshToken)
      .then(() => {
        dispatch({ type: 'auth/logout' })
        document.cookie = 'token=; Max-Age=0; path=/;'
        router.push('/login')
      })
      .catch((error) => {
        handleApiError(error)
      })
  }
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-2 flex flex-col overflow-auto pt-12"
        >
          <Menu />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <div className="text-center md:text-left">AYS</div>
      </div>
      <div className="flex space-x-2">
        <LanguageToggle />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={'flex cursor-pointer'}>
              <div className={'grid ml-3'}>
                <span className={'font-bold text-sm flex justify-end'}>
                  {userInfo?.userFirstName} {userInfo?.userLastName}
                </span>
                <span className={'text-sm'}>{userInfo?.institutionName}</span>
              </div>

              <Avatar className={'float-right ml-3'}>
                <AvatarFallback>
                  <LuUser2 size={22} />
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => logout()}>
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Navbar
