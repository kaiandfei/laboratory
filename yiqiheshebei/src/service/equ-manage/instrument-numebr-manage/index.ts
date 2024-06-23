import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import { numberManageList, instrumentDetailList, assetNumberList, sendData } from './types'

//获取仪器编号列表
export const getNumberManageList = (data: { page: number; keyword: string }) => {
  return myRequest.post<RootObject<numberManageList>>({
    url: '/schooldvc/SchoolInstrument/instrumentNumberList',
    data
  })
}

// 获取仪器详情
export const getInstrumentDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<instrumentDetailList>>({
    url: '/schooldvc/SchoolInstrument/instrumentNumberDetail',
    data
  })
}

//编辑仪器详情
export const editDetail = (data: sendData) => {
  return myRequest.post<RootObject<instrumentDetailList>>({
    url: '/schooldvc/SchoolInstrument/editInstrumentNumber',
    data
  })
}

//获取资产编号列表
export const getAssetNumberList = (data: { number: string }) => {
  return myRequest.post<RootObject<assetNumberList>[]>({
    url: '/schooldvc/SchoolInstrument/oneInstrumentNumberList',
    data
  })
}

// 生成资产编号
export const editAssetNumber = (data: any) => {
  return myRequest.post<RootObject<assetNumberList>>({
    url: '/schooldvc/SchoolInstrument/editInstrumentNumber',
    data
  })
}
