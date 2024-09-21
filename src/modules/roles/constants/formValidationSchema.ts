import { hasNoNumberNoSpecialChar } from '@/lib/hasNoNumberNoSpecialChar'
import { z } from 'zod'
import i18n from '@/i18n'

const RolesSchema = z.object({
  name: z
    .string()
    .min(2, { message: i18n.t('role.minLength') })
    .max(255, { message: i18n.t('role.maxLength') })
    .refine(hasNoNumberNoSpecialChar, {
      message: i18n.t('role.noSpecialChar'),
    }),
  status: z.string(),
  createdUser: z.string(),
  createdAt: z.string(),
  updatedUser: z.string(),
  updatedAt: z.string(),
})

export const FormValidationSchema = RolesSchema
