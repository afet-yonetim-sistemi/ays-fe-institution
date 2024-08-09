export interface RoleListing {
  content: any[]
  totalPageCount: number
}
export interface RoleListingTableProps {
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface Search {
  page: number
  per_page: number
  sort: string | undefined
  name: string | undefined
  status: string | undefined
  createdAt: string | undefined
  updatedAt: string | undefined
}

export interface StatusProps {
  status: string
}
