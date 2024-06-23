import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

// 创建数据图标组件
export const createDiagramComponent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/createDiagramComponent',
    data
  })
}

// 创建数据图标组件
export const Laboratorytype = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/schooldvc/Laboratorytype/index',
    data
  })
}

// 获取实验开课列表
export const expBookList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClass/expBookList',
    data
  })
}

// 获取实验开课列表报表
export const expBookStatisticalChart = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClass/expBookStatisticalChart',
    data
  })
}

// 获取仪器设备列表
export const IntegrationInstrumentList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/IntegrationInstrumentList',
    data
  })
}

// 获取仪器设备报表
export const CreateInstrumentDiagram = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/CreateInstrumentDiagram',
    data
  })
}

// 获取功能室列表
export const LaborAllAssetsList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/LaborAllAssetsList',
    data
  })
}

// 获取功能室报表
export const CreateLaborDiagram = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/CreateLaborDiagram',
    data
  })
}
