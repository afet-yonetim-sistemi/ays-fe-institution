import { UserFormValues, UserDetails, User } from './types'
import { z } from 'zod'
import { FieldErrors } from 'react-hook-form'
import { emailRegex } from '@/constants/regex'
import {
  strictNameValidation,
  nameboxWithLengthValidation,
} from '@/lib/strictValidation'
import { PhoneNumberSchema } from '@/constants/formValidationSchema'

export const userFormConfig = {
  fields: {
    firstName: {
      name: 'firstName',
      label: 'common.firstName',
      type: 'text',
      required: true,
    },
    lastName: {
      name: 'lastName',
      label: 'common.lastName',
      type: 'text',
      required: true,
    },
    emailAddress: {
      name: 'emailAddress',
      label: 'user.email',
      type: 'email',
      required: true,
    },
    phoneNumber: {
      name: 'phoneNumber',
      label: 'user.phoneNumber',
      type: 'phone',
      required: true,
    },
    city: {
      name: 'city',
      label: 'user.city',
      type: 'city',
      required: true,
    },
  },

  validationSchemaDetail: z.object({
    id: z.string(),
    firstName: strictNameValidation,
    lastName: strictNameValidation,
    emailAddress: z
      .string({
        required_error: 'validation.required',
      })
      .trim()
      .min(6, { message: 'validation.minLength' })
      .max(254, { message: 'validation.maxLength' })
      .regex(emailRegex, { message: 'validation.email' }),
    phoneNumber: PhoneNumberSchema,
    city: nameboxWithLengthValidation(2, 100),
    roleIds: z.array(z.string()).min(1, { message: 'validation.required' }),
    status: z.string(),
    createdUser: z.string(),
    createdAt: z.string(),
    updatedUser: z.string(),
    updatedAt: z.string(),
  }),

  validationSchemeCreate: z.object({
    firstName: strictNameValidation,
    lastName: strictNameValidation,
    emailAddress: z
      .string({
        required_error: 'validation.required',
      })
      .trim()
      .min(6, { message: 'validation.minLength' })
      .max(254, { message: 'validation.maxLength' })
      .regex(emailRegex, { message: 'validation.email' }),
    phoneNumber: PhoneNumberSchema,
    city: nameboxWithLengthValidation(2, 100),
    roleIds: z.array(z.string()).min(1, { message: 'validation.required' }),
  }),

  getDefaultValues: (userDetails?: UserDetails): UserFormValues => ({
    firstName: userDetails?.firstName ?? '',
    lastName: userDetails?.lastName ?? '',
    emailAddress: userDetails?.emailAddress ?? '',
    city: userDetails?.city ?? '',
    phoneNumber: {
      countryCode: userDetails?.phoneNumber?.countryCode ?? '90',
      lineNumber: userDetails?.phoneNumber?.lineNumber ?? '',
    },
    roleIds: userDetails?.roles?.map((role) => role.id) ?? [],
  }),

  getPayload: (formValues: UserFormValues) => ({
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    emailAddress: formValues.emailAddress,
    phoneNumber: {
      countryCode: formValues.phoneNumber.countryCode,
      lineNumber: formValues.phoneNumber.lineNumber,
    },
    city: formValues.city,
    roleIds: formValues.roleIds,
  }),

  getCurrentValues: (
    watchedValues: Partial<UserFormValues>,
    selectedRoles: string[],
    initialValues?: User | null
  ): UserFormValues => ({
    firstName: watchedValues.firstName ?? initialValues?.firstName ?? '',
    lastName: watchedValues.lastName ?? initialValues?.lastName ?? '',
    emailAddress:
      watchedValues.emailAddress ?? initialValues?.emailAddress ?? '',
    city: watchedValues.city ?? initialValues?.city ?? '',
    phoneNumber: {
      countryCode: watchedValues.phoneNumber?.countryCode ?? '90',
      lineNumber:
        watchedValues.phoneNumber?.lineNumber ??
        initialValues?.phoneNumber?.lineNumber ??
        '',
    },
    roleIds: selectedRoles,
  }),

  hasFormChanged: (
    currentValues: UserFormValues,
    initialValues: UserDetails
  ): boolean => {
    const fieldChanges = [
      'firstName',
      'lastName',
      'emailAddress',
      'city',
      'phoneNumber',
    ].some((key) => {
      if (key === 'phoneNumber') {
        return (
          currentValues.phoneNumber.countryCode !==
            initialValues.phoneNumber?.countryCode ||
          currentValues.phoneNumber.lineNumber !==
            initialValues.phoneNumber?.lineNumber
        )
      }
      return (
        currentValues[key as keyof UserFormValues] !==
        initialValues[key as keyof UserDetails]
      )
    })

    const initialRoleIds = initialValues.roles?.map((role) => role.id) || []
    const roleChanges =
      JSON.stringify(currentValues.roleIds) !== JSON.stringify(initialRoleIds)

    return fieldChanges || roleChanges
  },

  isSaveButtonDisabled: (
    isFormChanged: boolean,
    formErrors: FieldErrors<UserFormValues>
  ): boolean => {
    return (
      !isFormChanged ||
      Boolean(formErrors.firstName) ||
      Boolean(formErrors.lastName) ||
      Boolean(formErrors.emailAddress) ||
      Boolean(formErrors.phoneNumber) ||
      Boolean(formErrors.city) ||
      Boolean(formErrors.roleIds)
    )
  },
} as const
