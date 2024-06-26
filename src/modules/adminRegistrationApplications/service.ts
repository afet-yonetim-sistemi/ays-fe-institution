import http from '@/configs/axiosConfig'

export function postAdminRegistrationApplications(
  page: number,
  pageSize: number,
  statues: string[],
  sortType: string,
) {
  return http.post('/api/v1/admin-registration-applications', {
    pageable: {
      page: page,
      pageSize: pageSize,
      orders: [
        {
          property: 'createdAt',
          direction: sortType || 'ASC',
        },
      ],
    },
    filter: {
      statuses: statues,
    },
  })
}
