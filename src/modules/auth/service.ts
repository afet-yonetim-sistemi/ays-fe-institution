import { api } from '@/configs/axiosConfig'

const authService = {
  login: (data: any) => api.post('/authentication/admin/token', data),
}

export default authService
