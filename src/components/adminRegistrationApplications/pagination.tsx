import React from 'react'
import { clsx } from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useTranslation } from 'react-i18next'

const Pagination = ({ totalPage }: { totalPage: number }) => {
  const pathname: string = usePathname()
  const searchParams = useSearchParams()

  const currentPage: number = Number(searchParams.get('page')) || 1
  const createPageURL = (pageNumber: number | string) => {
    const params: URLSearchParams = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-8 float-end">
      <div>{`${t('page')} ${currentPage}/${totalPage}`}</div>
      <div className="flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPage}
        />
      </div>
    </div>
  )
}

export default Pagination

const PaginationArrow = ({
  href,
  direction,
  isDisabled,
}: {
  href: string
  direction: 'left' | 'right'
  isDisabled?: boolean
}) => {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-900/10 dark:hover:bg-gray-900': !isDisabled,
      'mr-1': direction === 'left',
      'ml-1': direction === 'right',
    },
  )

  const icon: React.JSX.Element =
    direction === 'left' ? (
      <IoIosArrowBack className="w-4" />
    ) : (
      <IoIosArrowForward className="w-4" />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  )
}
