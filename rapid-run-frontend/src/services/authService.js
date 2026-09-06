import api from './api'
const authService = {
  login:    (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }).then(r => r.data),
}
export default authService
