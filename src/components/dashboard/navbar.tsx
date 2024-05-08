import React from 'react'
import { Button } from '../ui/button'
import Menu from './menu'
import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { ModeToggle } from './mode-toggle'
import LanguageToggle from './language-toggle'

function Navbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-2 flex flex-col overflow-auto pt-12">
          <Menu />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <div className="text-center md:text-left">AYS</div>
      </div>
      <div className="flex space-x-2">
        <LanguageToggle />
        <ModeToggle />
      </div>
    </header>
  )
}

export default Navbar
