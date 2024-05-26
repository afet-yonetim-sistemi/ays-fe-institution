import http from '@/configs/axiosConfig'

export function postAdminRegistrationApplications(
  page: number,
  pageSize: number,
  statues: string[],
  sortType: string,
) {
  return http.post('/api/v1/admin-registration-applications', {
    pagination: {
      page: page,
      pageSize: pageSize,
    },
    filter: {
      statuses: statues,
    },
    sort: [
      {
        property: 'createdAt',
        direction: sortType || 'ASC',
      },
    ],
  })
}
