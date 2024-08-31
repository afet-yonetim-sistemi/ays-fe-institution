import * as z from 'zod'
import { pageSize } from '@/constants/common'

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(pageSize),
  sort: z.string().optional(),
  status: z.string().optional(),
  referenceNumber: z.string().optional(),
  seatingCount: z.string().optional(),
  sourceCity: z.string().optional(),
  sourceDistrict: z.string().optional(),
  targetCity: z.string().optional(),
  targetDistrict: z.string().optional(),
  isInPerson: z.any().default(null),
})
