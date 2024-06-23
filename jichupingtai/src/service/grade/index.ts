import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getGradeList = (data:any) => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Grade/findgrade',
    data
  })
}

