import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

api.interceptors.request.use(config => {
  const stored = localStorage.getItem('tm_user')
  if (stored) {
    const { token } = JSON.parse(stored)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tm_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
