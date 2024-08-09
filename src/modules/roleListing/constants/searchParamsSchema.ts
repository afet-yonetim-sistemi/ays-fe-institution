import * as z from 'zod'
import { pageSize } from '@/constants/common'

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(pageSize),
  sort: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
