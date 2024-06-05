import React from 'react'

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { cn } from '@/lib/utils'
import { generatePagination } from '@/lib/generatePagination'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  totalPages: number
  currentPage: number
  setCurrentPage: (page: number) => void
}

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const allPages = generatePagination(currentPage, totalPages)
  if (totalPages < 2) setCurrentPage(1)
  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          onClick={() => setCurrentPage(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined

            if (index === 0) position = 'first'
            if (index === allPages.length - 1) position = 'last'
            if (allPages.length === 1) position = 'single'
            if (page === '...') position = 'middle'
            return (
              <PaginationNumber
                key={page}
                onClick={() => setCurrentPage(Number(page))}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            )
          })}
        </div>

        <PaginationArrow
          direction="right"
          onClick={() => setCurrentPage(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  )
}

function PaginationNumber({
  page,
  onClick,
  isActive,
  position,
}: {
  page: number | string
  onClick: any
  position?: 'first' | 'last' | 'middle' | 'single'
  isActive: boolean
}) {
  const className = cn(
    'flex h-10 w-10 border-none items-center justify-center text-sm border',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 rounded bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-800/10 dark:hover:bg-gray-800':
        !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    },
  )

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Button variant="ghost" onClick={onClick} className={className}>
      {page}
    </Button>
  )
}

function PaginationArrow({
  onClick,
  direction,
  isDisabled,
}: {
  onClick: any
  direction: 'left' | 'right'
  isDisabled?: boolean
}) {
  const className = cn(
    'flex h-10 w-10 p-0 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'hover:bg-gray-800/10 dark:hover:bg-gray-800': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    },
  )

  const icon =
    direction === 'left' ? (
      <IoIosArrowBack className="w-4" />
    ) : (
      <IoIosArrowForward className="w-4" />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Button variant="outline" className={className} onClick={onClick}>
      {icon}
    </Button>
  )
}

export default Pagination
