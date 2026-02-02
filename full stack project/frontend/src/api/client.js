import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
})

// helper to set/remove Authorization header (for token-based backends)
export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}

// lightweight logging in non-production to help debugging
if (import.meta.env.MODE !== 'production') {
  api.interceptors.request.use((cfg) => {
    try {
      // eslint-disable-next-line no-console
      console.debug('[api] request', cfg.method, cfg.url, cfg.data)
    } catch (e) {}
    return cfg
  })

  api.interceptors.response.use(
    (res) => {
      try {
        // eslint-disable-next-line no-console
        console.debug('[api] response', res.status, res.config.url, res.data)
      } catch (e) {}
      return res
    },
    (err) => {
      try {
        // eslint-disable-next-line no-console
        console.debug('[api] response error', err?.response?.status, err?.config?.url, err?.response?.data)
      } catch (e) {}
      return Promise.reject(err)
    },
  )
}

export default api
