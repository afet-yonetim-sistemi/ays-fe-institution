'use client'
import { useSidebarCollapse } from '@/hooks/useSidebarCollapse'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import Menu from './menu'

export default function Sidebar(): JSX.Element {
  const { collapsed, setCollapsed } = useSidebarCollapse()
  const { t } = useTranslation()

  return (
    <div
      className={`hidden h-full overflow-auto border-r bg-muted/40 transition-all duration-200 md:block ${collapsed ? 'md:w-[70px] lg:w-[72px]' : 'md:w-[220px] lg:w-[280px]'} min-w-0`}
    >
      <div className="flex h-full max-h-screen flex-col">
        <div
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} border-b border-muted-foreground/10 px-2 pb-2 pt-4`}
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
