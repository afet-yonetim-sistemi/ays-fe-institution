'use client'

import { cn } from '@/shadcn/lib/utils'
import {
  TooltipContent,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from '@/shadcn/ui/tooltip'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React from 'react'

type TooltipSide = 'top' | 'right' | 'bottom' | 'left'
type TooltipAlign = 'start' | 'center' | 'end'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: TooltipSide
  align?: TooltipAlign
  sideOffset?: number
  delayDuration?: number
  disabled?: boolean
}

const Tooltip = ({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 8,
  delayDuration = 200,
  disabled = false,
}: TooltipProps): React.ReactNode => {
  if (disabled || content === null || content === undefined || content === '') {
    return <>{children}</>
  }

  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(
          'max-w-xs px-2.5 py-1.5 text-xs font-normal break-words whitespace-normal'
        )}
      >
        {content}
        <TooltipPrimitive.Arrow
          width={10}
          height={5}
          className="fill-popover"
        />
      </TooltipContent>
    </TooltipRoot>
  )
}

export default Tooltip
