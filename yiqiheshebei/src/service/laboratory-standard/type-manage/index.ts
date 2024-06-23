import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { RequestDataLabType, AddForm, DelForm } from './types'

// 实验室类型列表
export const getTypeList = () => {
  return myRequest.post<RootObject<RequestDataLabType[]>>({
    url: '/schooldvc/Laboratorytype/index'
  })
}

// 新增实验室类型列表
export const addLabType = (data: AddForm) => {
  return myRequest.post<RootObject<RequestDataLabType>>({
    url: '/schooldvc/Laboratorytype/manage',
    data
  })
}

// 删除实验室类型列表
export const delLabType = (data: DelForm) => {
  return myRequest.post<RootObject<RequestDataLabType>>({
    url: '/schooldvc/Laboratorytype/del',
    data
  })
}
