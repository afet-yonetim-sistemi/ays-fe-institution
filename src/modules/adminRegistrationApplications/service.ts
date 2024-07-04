import { ApiResponse } from '@/app/(private)/admin-registration-applications/types';
import http from '@/configs/axiosConfig';
import { AxiosResponse } from 'axios';

export const getAdminRegistrationApplication = async (id: string): Promise<AxiosResponse<ApiResponse>> => {
  return http.get<ApiResponse>(`/api/v1/admin-registration-application/${id}`);
};

export const postAdminRegistrationApplications = (
  page: number,
  pageSize: number,
  statuses: string[],
  sortType: string,
) => {
  return http.post('/api/v1/admin-registration-applications', {
    pageable: {
      page: page,
      pageSize: pageSize,
    },
    filter: {
      statuses: statuses,
    },
    orders: [
      {
        property: 'createdAt',
        direction: sortType || 'ASC',
      },
    ],
  });
};
