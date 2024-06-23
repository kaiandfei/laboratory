import axios from 'axios'
import localCache from '@/utils/localCache'
import { exitLogin } from '@/utils/device-interaction'
import { Message } from 'element-ui'

function requestBody(config, url) {
  const instance = axios.create({
    baseURL: url,
    timeout: 50000,
  })
  // 请求拦截
  instance.interceptors.request.use((config) => {
    const token = localCache.getCookie('swr_token') || ''
    if (token) {
      config.headers.Authorization = 'Bearer' + token
    }
    return config
  })
  // 响应拦截
  const device_no = localCache.getCookie('device_no') || ''
  instance.interceptors.response.use(
    (res) => {
      // if (res.data.code === 500) {
      //   router.replace({
      //     path: '/'
      //   })
      // }
      if (res.headers.authorization) {
        localCache.setCookie(
          'swr_token',
          res.headers.authorization.replace(/Bearer\s*/, '')
        )
      }
      if (res.data.code === 20) {
        // return Promise.reject(res.data.msg)
        Message({
          type: 'error',
          message: res.data.msg,
        })
      } else if (res.data.code === 30) {
        exitLogin(device_no)
        Message({
          type: 'error',
          message: res.data.msg,
        })
      } else if (res.data.code === 555) {
        exitLogin(device_no)
        Message({
          type: 'error',
          message: '请联系开发人员检查接口数据',
        })
      }
      return res.data
    },
    (err) => {
      exitLogin(device_no)
      return Promise.reject(err)
    }
  )
  return instance(config)
}

export function request(config) {
  return requestBody(config, process.env.VUE_APP_APP_BASEURL)
}

export function requestBase(config) {
  return requestBody(config, process.env.VUE_APP_APP_BASEURL_BASE)
}
