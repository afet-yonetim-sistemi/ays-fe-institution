import http from '@/configs/axiosConfig'
import {
  EmergencyApplicationApiResponse,
  Search,
} from '@/modules/emergencyEvacuationApplications/constants/types'
import { AxiosResponse } from 'axios'

export function postEmergencyEvacuationApplications(
  search: Search
): Promise<AxiosResponse> {
  const sortBy = search.sort
    ? [
        {
          property: search.sort.split('.')[0],
          direction: search.sort.split('.')[1].toUpperCase(),
        },
      ]
    : []
  const filterStatus = search.status
    ? search.status?.toUpperCase().split(`.`)
    : []

  return http.post('/api/v1/emergency-evacuation-applications', {
    pageable: {
      page: search.page,
      pageSize: search.per_page,
      orders: sortBy,
    },
    filter: {
      referenceNumber: search.referenceNumber,
      sourceCity: search.sourceCity,
      sourceDistrict: search.sourceDistrict,
      seatingCount: search.seatingCount,
      targetCity: search.targetCity,
      targetDistrict: search.targetDistrict,
      statuses: filterStatus,
      isInPerson: search.isInPerson,
    },
  })
}

export const getEmergencyEvacuationApplication = (
  id: string
): Promise<EmergencyApplicationApiResponse> => {
  return http
    .get<EmergencyApplicationApiResponse>(
      `/api/v1/emergency-evacuation-application/${id}`
    )
    .then((response) => response.data)
}
