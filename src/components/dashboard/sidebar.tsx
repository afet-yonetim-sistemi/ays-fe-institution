'use client'
import React from 'react'
import Menu from './menu'
import { Button } from '../ui/button'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useSidebarCollapse } from '@/hooks/useSidebarCollapse'
import { useTranslation } from 'react-i18next'

export default function Sidebar(): JSX.Element {
  const { collapsed, setCollapsed } = useSidebarCollapse()
  const { t } = useTranslation()

  return (
    <div
      className={`hidden border-r bg-muted/40 md:block overflow-auto transition-all duration-200 h-full ${collapsed ? 'md:w-[70px] lg:w-[72px]' : 'md:w-[220px] lg:w-[280px]'} min-w-0`}
    >
      <div className="flex h-full max-h-screen flex-col">
        <div
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} px-2 pt-4 pb-2 border-b border-muted-foreground/10`}
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? t('expandTheMenu') : t('collapseTheMenu')}
            onClick={() => setCollapsed(!collapsed)}
            className=""
          >
            {collapsed ? (
              <ChevronsRight size={22} />
            ) : (
              <ChevronsLeft size={22} />
            )}
          </Button>
        </div>
        <div className="flex-1">
          <Menu collapsed={collapsed} />
        </div>
      </div>
    </div>
  )
}
