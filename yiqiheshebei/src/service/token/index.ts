import requestClass from '../request/index'
import { BASE_URL, BASE_URL_BASE } from '../request/config'

import localCache from '@/utils/localCache'

export const myRequest = new requestClass({
  baseURL: BASE_URL,
  timeout: 30 * 60 * 1000,
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

export const BaseRequest = new requestClass({
  baseURL: BASE_URL_BASE,
  timeout: 30 * 60 * 1000,
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
  baseURL: 'https://swryzapi.swrtest.com/',
  timeout: 30 * 60 * 1000,
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
