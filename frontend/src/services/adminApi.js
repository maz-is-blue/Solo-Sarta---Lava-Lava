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

export const getAdminProducts = (brand) =>
  adminApi.get('/products', { params: { brand } })

export const createAdminProduct = (data) =>
  adminApi.post('/products', data)

export const updateAdminProduct = (id, data) =>
  adminApi.put(`/products/${id}`, data)

export const deleteAdminProduct = (id) =>
  adminApi.delete(`/products/${id}`)

export const uploadMedia = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return adminApi.post('/media/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const getAdminOrders = (params = {}) =>
  adminApi.get('/orders', { params })

export const updateAdminOrder = (id, data) =>
  adminApi.put(`/orders/${id}`, data)

export const getAdminVideos = (brand) =>
  adminApi.get('/videos', { params: { brand } })

export const createAdminVideo = (data) =>
  adminApi.post('/videos', data)

export const deleteAdminVideo = (id) =>
  adminApi.delete(`/videos/${id}`)

export const uploadVideo = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return adminApi.post('/media/upload-video', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export default adminApi
