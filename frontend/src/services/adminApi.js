import axios from 'axios'

const adminApi = axios.create({
  baseURL: '/api/admin',
  headers: { 'Content-Type': 'application/json' }
})

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('ss_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const adminLogin = (password) =>
  adminApi.post('/login', { password })

export const getAdminContent = (brand) =>
  adminApi.get('/content', { params: { brand } })

export const updateContent = (id, value) =>
  adminApi.put(`/content/${id}`, { value })

export const bulkUpdateContent = (updates) =>
  adminApi.post('/content/bulk', { updates })

export default adminApi
