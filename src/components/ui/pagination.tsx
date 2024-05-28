import React from 'react'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
interface PaginationProps {
  page?: string
  totalPage: number
}
const Pagination = (props: PaginationProps) => {
  const { page = 1, totalPage } = props
  const router = useRouter()
  const currentPage = Number(page)
  if (totalPage == 1) router.push('?page=1')
  const getPagesToShow = () => {
    let startPage = currentPage - 2
    let endPage = currentPage + 2
    if (currentPage <= 2) {
      startPage = 1
      endPage = totalPage - 1
    } else if (currentPage >= totalPage - 2) {
      startPage = totalPage - 2
      endPage = totalPage - 1
    }
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    )
  }
  const pages = getPagesToShow()
  return (
    <div className="flex items-center gap-8 float-end">
      <div className="flex">
        <PaginationArrow
          direction="left"
          href={`?page=${currentPage - 1}`}
          isDisabled={currentPage <= 1}
        />
        <nav
          aria-label="Pagination"
          className="relative z-0 inline-flex -space-x-px rounded-md"
        >
          {!(totalPage == 1) &&
            pages.map((p, i) => (
              <Link
                key={p}
                className={cn(
                  'relative inline-flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-50',
                  p === currentPage
                    ? 'pointer-events-none bg-gray-100 rounded'
                    : '',
                )}
                href={`?page=${p}`}
              >
                {p}
              </Link>
            ))}
          <Link
            className={cn(
              'relative inline-flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-50',
              totalPage === currentPage
                ? 'pointer-events-none bg-gray-100 rounded'
                : '',
            )}
            href={`?page=${totalPage}`}
          >
            {totalPage}
          </Link>
        </nav>
        <PaginationArrow
          direction="right"
          href={`?page=${currentPage + 1}`}
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
  const className = cn(
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
