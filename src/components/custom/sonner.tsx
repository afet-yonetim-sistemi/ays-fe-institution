'use client'

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import type { ComponentProps, ReactElement } from 'react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = ComponentProps<typeof Sonner>

const Toaster = (props: ToasterProps): ReactElement => {
  const { theme = 'system' } = useTheme()
  const { toastOptions: toastOptionsProp, ...rest } = props

  return (
    <Sonner
      theme={theme as ComponentProps<typeof Sonner>['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        ...toastOptionsProp,
        classNames: {
          ...toastOptionsProp?.classNames,
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          title:
            'group-[.error]:!text-destructive-foreground group-[.success]:!text-success-foreground group-[.warning]:!text-warning-foreground font-semibold',
          description:
            'group-[.toast]:text-muted-foreground group-[.error]:!text-destructive-foreground/90 group-[.success]:!text-success-foreground/90 group-[.warning]:!text-warning-foreground/90',
          success:
            'group success group-[.toaster]:!bg-success group-[.toaster]:!text-success-foreground group-[.toaster]:!border-success',
          error:
            'group error group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive',
          warning:
            'group warning group-[.toaster]:!bg-warning group-[.toaster]:!text-warning-foreground group-[.toaster]:!border-warning',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...rest}
    />
  )
}

export { Toaster }
