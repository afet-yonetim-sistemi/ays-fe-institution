import http from '@/configs/axiosConfig';

export const getAdminRegistrationApplication = (id: string) => {
  return http.get(`/api/v1/admin-registration-application/${id}`);
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
