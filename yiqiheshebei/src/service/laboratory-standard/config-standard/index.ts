import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { SelectForm, RequestData, AddForm, SavaForm } from './types'

// 实验室配置标准列表
export const getConfigSetList = (data: SelectForm) => {
  return myRequest.post<RootObject<RequestData[]>>({
    url: '/schooldvc/raillaboratorystandard/configurationList',
    data
  })
}

// 实验室配置新增
export const addLaboratorySet = (data: AddForm) => {
  return myRequest.post<RootObject<RequestData>>({
    url: '/schooldvc/raillaboratorystandard/laboratoryAdd',
    data
  })
}

// 实验室配置删除
export const delLaboratorySet = (data: { id: number }) => {
  return myRequest.post<RootObject<RequestData>>({
    url: '/schooldvc/raillaboratorystandard/laboratoryDel',
    data
  })
}

// 实验室配置修改
export const saveConfiguration = (data: SavaForm) => {
  return myRequest.post<RootObject<RequestData>>({
    url: '/schooldvc/raillaboratorystandard/configurationSave',
    data
  })
}

// 实验室配备标准删除
export const delConfiguration = (data: { id: number }) => {
  return myRequest.post<RootObject<RequestData>>({
    url: '/schooldvc/raillaboratorystandard/configurationDel',
    data
  })
}
