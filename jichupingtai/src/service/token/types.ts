export interface IServerDataType<T = any> {
  code: number
  msg: string
  message?: string
  data: T
}
