import http from '@/configs/axiosConfig'
import { FormSchema } from '@/modules/adminRegistrationApplications/constants/formSchema'

export const getRegistrationApplication = (
  id: string,
): Promise<typeof FormSchema> =>
  http.get(`/api/v1/admin-registration-application/${id}/summary`)

export const postRegistrationApplication = (id: string, form: any) =>
  http.post(`api/v1/admin-registration-application/${id}/complete`, form)
