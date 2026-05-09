import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' }
})

export const getProducts = (params = {}) => api.get('/products', { params })
export const getProduct = (slug) => api.get(`/products/${slug}`)
export const addToCart = (data) => api.post('/cart', data)
export const getCart = () => api.get('/cart')
export const updateCartItem = (id, quantity) => api.put(`/cart/${id}`, { quantity })
export const removeCartItem = (id) => api.delete(`/cart/${id}`)
export const submitContact = (data) => api.post('/contact', data)
export const subscribeNewsletter = (email, brand = 'lava') => api.post('/newsletter', { email, brand })

export default api
