import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'

// 获取仪器盘点列表
export const getCheckList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/recordTotalBySubject',
    data
  })
}

// 获取详情信息
export const getDetailInfo = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/recordTotal',
    data
  })
}

// 获取盘点报告信息
export const getCheckReportList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/recordDetail',
    data
  })
}

// 导出盘点报告单
export const pullCheckReport = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/export',
    data
  })
}

// 开始盘点，新增盘点记录
export const addCheckData = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/addInventory',
    data
  })
}

// 保存盘点信息
export const saveCheckData = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/saveImmediately',
    data
  })
}

// 结束盘点
export const endCheckData = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/finishInventory',
    data
  })
}

// 获取储藏脉络
export const getLocationInfo = () => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/storeTree'
  })
}

// 获取资产列表
export const getInfoList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInventory/pliesInstrumentList',
    data
  })
}

// 获取表格仪器数据
export const getInsExcelList = (data: any) => {
  return myRequest.post<RootObject<any>>({
    url: '/schooldvc/SchoolInstrument/instrumentExcel',
    data
  })
}
