import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 30000,
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('rr_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rr_token')
      localStorage.removeItem('rr_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
