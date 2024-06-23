import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getPageData = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: 'serve/UserDaily/getPageData',
    data
  })
}
