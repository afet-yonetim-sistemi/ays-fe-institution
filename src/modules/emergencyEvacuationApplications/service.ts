import { BaseApiResponse } from '@/common/types'
import http from '@/configs/axiosConfig'
import {
  EmergencyApplicationApiResponse,
  EmergencyEvacuationApplicationsFilter,
  EvacuationApplicationEditableFields,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import { AxiosResponse } from 'axios'

export const getEmergencyEvacuationApplications = (
  filter: EmergencyEvacuationApplicationsFilter
): Promise<AxiosResponse> => {
  const orders =
    filter.sort && filter.sort.length > 0
      ? filter.sort.map((sort) => ({
          property: sort?.column,
          direction: sort?.direction?.toUpperCase(),
        }))
      : undefined

  return http.post('/api/v1/emergency-evacuation-applications', {
    pageable: {
      page: filter.page || 1,
      pageSize: filter.pageSize || 10,
      ...(orders ? { orders } : []),
    },
    filter: {
      ...(filter.statuses.length > 0
        ? { statuses: filter.statuses }
        : undefined),
      referenceNumber: filter.referenceNumber || undefined,
      sourceCity: filter.sourceCity || undefined,
      sourceDistrict: filter.sourceDistrict || undefined,
      seatingCount: filter.seatingCount ?? undefined,
      targetCity: filter.targetCity || undefined,
      targetDistrict: filter.targetDistrict || undefined,
      isInPerson: filter.isInPerson ?? undefined,
    },
  })
}

export const getEmergencyEvacuationApplication = async (
  id: string
): Promise<EmergencyApplicationApiResponse> => {
  return http
    .get<EmergencyApplicationApiResponse>(
      `/api/v1/emergency-evacuation-application/${id}`
    )
    .then((response) => response.data)
}

export const updateEmergencyEvacuationApplication = async (
  id: string,
  data: EvacuationApplicationEditableFields
): Promise<BaseApiResponse> => {
  return http
    .put(`/api/v1/emergency-evacuation-application/${id}`, data)
    .then((response) => response.data)
}
