import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

export const getSubjectList = () => {
  return testRequest.post<IServerDataType>({
    url: 'swrserveadmin/Subject/findSubject',
  })
}

