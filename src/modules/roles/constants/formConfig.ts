import { roleNameValidation } from '@/lib/strictValidation'
import { FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { RoleDetail } from './types'

export interface RoleFormValues {
  id?: string
  name: string
  status?: string
  createdUser?: string
  createdAt?: string
  updatedUser?: string | null
  updatedAt?: string | null
  permissionIds: string[]
}

export const roleFormConfig = {
  fields: {
    name: {
      name: 'name',
      label: 'role.name',
      type: 'text',
      required: true,
    },
  },

  validationSchema: z.object({
    name: roleNameValidation,
    permissionIds: z
      .array(z.string())
      .min(1, { message: 'validation.required' }),
  }),

  validationSchemaCreate: z.object({
    name: roleNameValidation,
    permissionIds: z
      .array(z.string())
      .min(1, { message: 'validation.required' }),
  }),

  validationSchemaDetail: z.object({
    id: z.string().optional(),
    name: roleNameValidation,
    status: z.string().optional(),
    createdUser: z.string().optional(),
    createdAt: z.string().optional(),
    updatedUser: z.string().optional().nullable(),
    updatedAt: z.string().optional().nullable(),
    permissionIds: z
      .array(z.string())
      .min(1, { message: 'validation.required' }),
  }),

  getDefaultValues: (roleDetails?: RoleDetail): RoleFormValues => ({
    name: roleDetails?.name ?? '',
    permissionIds: roleDetails?.permissions?.map((p) => p.id) ?? [],
  }),

  getPayload: (formValues: RoleFormValues) => ({
    name: formValues.name,
    permissionIds: formValues.permissionIds,
  }),

  getCreatePayload: (formValues: RoleFormValues) => ({
    name: formValues.name,
    permissionIds: formValues.permissionIds,
  }),

  getCurrentValues: (
    watchedValues: Partial<RoleFormValues>,
    initialValues?: RoleDetail | null
  ): RoleFormValues => ({
    name: watchedValues.name ?? initialValues?.name ?? '',
    permissionIds:
      watchedValues.permissionIds ??
      initialValues?.permissions?.map((p) => p.id) ??
      [],
  }),

  hasFormChanged: (
    currentValues: RoleFormValues,
    initialValues: RoleDetail
  ): boolean => {
    const nameChanged = currentValues.name !== initialValues.name
    const initialPermissionIds =
      initialValues.permissions?.map((p) => p.id) ?? []
    const permissionsChanged =
      currentValues.permissionIds.length !== initialPermissionIds.length ||
      currentValues.permissionIds.some(
        (id) => !initialPermissionIds.includes(id)
      )

    return nameChanged || permissionsChanged
  },

  isSaveButtonDisabled: (
    isFormChanged: boolean,
    formErrors: FieldErrors<RoleFormValues>
  ): boolean => {
    return (
      !isFormChanged ||
      Boolean(formErrors.name) ||
      Boolean(formErrors.permissionIds)
    )
  },
} as const
