import { strictNameValidation } from '@/lib/strictValidation'
import { FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import { RoleDetail } from './types'

export interface RoleFormValues {
  name: string
  status?: string
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
    name: strictNameValidation,
  }),

  validationSchemaCreate: z.object({
    name: strictNameValidation,
  }),

  validationSchemaDetail: z.object({
    id: z.string(),
    name: strictNameValidation,
    status: z.string(),
    createdUser: z.string(),
    createdAt: z.string(),
    updatedUser: z.string(),
    updatedAt: z.string(),
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
