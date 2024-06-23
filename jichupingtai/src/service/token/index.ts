import requestClass from '../request/index'
import { BASE_URL, TEACH_URL, HC_URL } from '../request/config'
// import { store } from '@store/index'
import localCache from '@/utils/localCache'
import router from '@/router/index'

// import localCache from '@/utils/localCache'

export const zsRequest = new requestClass({
  baseURL: BASE_URL,
  timeout: 100000,
  interceptors: {
    requestInterceptors: (config) => {
      // const token = store.state.login.userInfo.token
      const token = localCache.getCookie('swr_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }
  }
})
export const hcRequest = new requestClass({
  baseURL: HC_URL,
  timeout: 100000,
  interceptors: {
    requestInterceptors: (config) => {
      // const token = store.state.login.userInfo.token
      const token = localCache.getCookie('swr_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }
  }
})
export const testRequest = new requestClass({
  baseURL: BASE_URL,
  timeout: 100000,
  interceptors: {
    requestInterceptors: (config) => {
      // const token = store.state.login.userInfo.token
      const token = localCache.getCookie('swr_token') || router.currentRoute.value.query.token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }
  }
})
export const teachRequest = new requestClass({
  baseURL: TEACH_URL,
  timeout: 100000,
  interceptors: {
    requestInterceptors: (config) => {
      // const token = store.state.login.userInfo.token
      const token = localCache.getCookie('swr_token') || router.currentRoute.value.query.token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    }
  }
})
