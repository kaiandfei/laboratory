import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface myRequestInterceptors<T = AxiosResponse> {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (error: unknown) => unknown
  responceinterceptors?: (response: T) => T
  responceInterceptorsCatch?: (error: unknown) => unknown
}

export interface myRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: myRequestInterceptors<T>
  showLoading?: boolean
}
