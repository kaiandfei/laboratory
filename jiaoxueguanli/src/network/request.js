import axios from 'axios'
import localCache from '@/utils/localCache'
// import router from '../router/index'
import { Message } from 'element-ui'

function requestBody(config, url) {
  const instance = axios.create({
    baseURL: url,
    timeout: 50000,
  })
  // 请求拦截
  instance.interceptors.request.use((config) => {
    const token = localCache.getCookie('swr_token')
    if (token) {
      config.headers.Authorization = 'Bearer' + token
    }
    return config
  })
  // 响应拦截
  instance.interceptors.response.use((res) => {
    // token过期验证
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
    if (![10, 30, 555].includes(res.data.code)) {
      Message({
        type: 'error',
        message: res.data.msg,
      })
    } else if (res.data.code === 30) {
      // Message({
      //   type: 'warning',
      //   message: '登录信息失效，三秒后跳转登录页'
      // })
      setTimeout(() => {
        window.location.href = process.env.VUE_APP_APP_LOGINURL
      }, 0)
    } else if (res.data.code === 555) {
      Message({
        type: 'error',
        message: '请联系开发人员检查接口数据',
      })
    }
    return res.data
  })
  return instance(config)
}

export function request(config) {
  return requestBody(config, process.env.VUE_APP_APP_BASEURL)
}

export function requestBase(config) {
  return requestBody(config, process.env.VUE_APP_APP_BASEURL_BASE)
}
