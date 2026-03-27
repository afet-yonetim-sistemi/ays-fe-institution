'use client'

import { Toaster as SonnerToaster } from '@/shadcn/ui/sonner'

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps): React.ReactNode => {
  return (
    <SonnerToaster
      {...props}
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description:
            'group-[.toast]:text-muted-foreground group-[.error]:!text-destructive-foreground/90 group-[.success]:!text-success-foreground/90',
          title:
            'group-[.error]:!text-destructive-foreground group-[.success]:!text-success-foreground font-semibold',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          error:
            'group error group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive',
          success:
            'group success group-[.toaster]:!bg-success group-[.toaster]:!text-success-foreground group-[.toaster]:!border-success',
        },
      }}
    />
  )
}

export { Toaster }
