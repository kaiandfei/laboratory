import { testRequest } from '../token/index'
import { IServerDataType } from '../token/types'

// 获取学年学期
export const findschoolyear = () => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/YearTerm/findschoolyear',
  })
}
// 获取市
export const getaccount = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/getPageData',
    data
  })
}
// 地图数据
export const InstrumentMap = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/getInstrumentComplianceRate',
    data
  })
}
// 地图坐标
export const findAreaOption = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/Area/findAreaOption',
    data
  })
}
// 开课率
export const expBookRate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClassDataCenter/expBookRate',
    data
  })
}
// 开课数
export const expBookNumBySubject = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClassDataCenter/expBookNumBySubject',
    data
  })
}
// 开课频次
export const expFrequency = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClassDataCenter/expFrequency',
    data
  })
}
// 年级开课数
export const expBookNumByGrade = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClassDataCenter/expBookNumByGrade',
    data
  })
}
// 装备总量趋势
export const instrumentFlow = (data: any) => {
  return testRequest.post<IServerDataType>({
    // url: '/InstrumentDataCenter/getInstrumentFlowData',
    url: '/dateCenter/InstrumentDataCenter/getInstrumentFlowData',
    data
  })
}
// 装备总量-达标率统计
export const instrumentAmountSummary = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/InstrumentAmountSummary',
    data
  })
}
// 功能室统计
export const laborData = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/LaborData',
    data
  })
}
// 功能室使用率统计
export const laborUseData = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/LaborUseData',
    data
  })
}
// 实验室使用频次
export const useFrequency = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/FunctionRoom/useFrequency',
    data
  })
}
// 实验室使用列表
export const useList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/FunctionRoom/useList',
    data
  })
}
// 实验开课数据
export const expBookDate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/GoClassDataCenter/expBookDate',
    data
  })
}
// 生均总达标率
export const StudentAvgSummary = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/StudentAvgSummary',
    data
  })
}
// 装备状态统计
export const InstrumentStatusSummary = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/InstrumentStatusSummary',
    data
  })
}
// 装备使用率
export const InstrumentUseRate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/InstrumentUseRate',
    data
  })
}
// 分类仪器总量达标率
export const InstrumentTypeAmountSummary = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/InstrumentDataCenter/InstrumentTypeAmountSummary',
    data
  })
}
// 实验室类型占比
export const laborTypeRate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/LaborTypeRate',
    data
  })
}
// 功能室总量达标统计
export const laborAmountReachStandBySubject = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/LaborAmountReachStandBySubject',
    data
  })
}
// 实验室利用率统计
export const laborComplianceRate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/LaborDataCenter/LaborComplianceRate',
    data
  })
}
// 实验开课数量
export const expBookNum = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DataCenter/expBookNum',
    data
  })
}
// 实验开课率
export const labExpBookRate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DataCenter/expBookRate',
    data
  })
}
// 查询各学科实验开课率
export const expBookRateBySubject = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DataCenter/expBookRateBySubject',
    data
  })
}
// 删除组件
export const deleteComponent = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/deleteComponent',
    data
  })
}
// 创建模板
export const makeDiagramTemplate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/makeDiagramTemplate',
    data
  })
}
// 删除模板
export const deleteDiagramTemplate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/deleteDiagramTemplate',
    data
  })
}
// 模板列表
export const diagramTemplateList = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/diagramTemplateList',
    data
  })
}
// 激活/取消激活模板
export const activeTemplate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/activeTemplate',
    data
  })
}
// 组件列表
export const diagramComponentList = () => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/diagramComponentList'
  })
}
export const selectUser = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/User/selectUser',
    data
  })
}
export const uploadImage = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrperipheral/ElectronicCardController/uploadImage',
    data
  })
}
export const getAreaCode = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/swrserveadmin/Area/findAreaOptionCode',
    data
  })
}
export const rankTemplate = (data: any) => {
  return testRequest.post<IServerDataType>({
    url: '/dateCenter/DiagramMaker/rankTemplate',
    data
  })
}
