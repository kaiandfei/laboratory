import requestClass from '../request/index'
import { BASE_URL, H_C_URL } from '../request/config'

import localCache from '@/utils/localCache'

export const zsRequest = new requestClass({
  baseURL: BASE_URL,
  timeout: 10000,
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
// 危化品后台
export const hcRequest = new requestClass({
  baseURL: H_C_URL,
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
  timeout: 10000,
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
