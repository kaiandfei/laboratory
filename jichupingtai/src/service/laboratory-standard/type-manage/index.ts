import { zsRequest } from '../../token/index'
import { IServerDataType } from '../../token/types'
// import { TestForm } from './types'

// 实验室类型列表
export const getTypeList = () => {
  return zsRequest.post<IServerDataType>({
    url: '/swrserveadmin/railtemplate/index'
  })
}
