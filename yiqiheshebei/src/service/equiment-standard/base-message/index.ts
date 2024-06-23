import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { BaseList, ListData, EditData } from './types'

// 基础仪器列表
export const getBaseInstrument = (data: { explode: number; page: number; number?: string }) => {
  return myRequest.post<RootObject<BaseList>>({
    url: '/schooldvc/baseinstrument/index',
    data
  })
}

// 获取单个仪器
export const getInstrumentSingle = (data: { number: string }) => {
  return myRequest.post<RootObject<ListData>>({
    url: '/schooldvc/baseinstrument/single',
    data
  })
}

// 导入数据
export const importExcel = (data: FormData) => {
  return myRequest.post<RootObject<ListData>>({
    url: '/schooldvc/baseinstrument/importExcel',
    data,
    timeout: 0
  })
}

// 编辑仪器
export const editInstrument = (data: EditData) => {
  return myRequest.post<RootObject<ListData>>({
    url: '/schooldvc/baseinstrument/singelManage',
    data
  })
}

// 获取单位
export const getUnits = () => {
  return myRequest.post<RootObject<{ id: number; title: string }[]>>({
    url: '/schooldvc/Units/units'
  })
}

// 删除基础仪器
export const deleteOne = (data: { id: number }) => {
  return myRequest.post<RootObject<ListData>>({
    url: '/schooldvc/baseinstrument/deleteOne',
    data
  })
}
