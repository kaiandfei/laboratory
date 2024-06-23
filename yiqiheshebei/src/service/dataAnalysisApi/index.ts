import { myRequest, BaseRequest } from '../token/index'
import { RootObject } from '../rootObject'

// 所有分类
export const allType = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/instrumentcategory/all',
    data
  })
}
// 省市区查询
export const findArea = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'swrserveadmin/Area/findArea',
    data
  })
}
// 学校查询
export const findSchool = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'swrserveadmin/School/findSchool',
    data
  })
}

// 实验配备达标分析
export const getStoreList = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/labSummary',
    data
  })
}

// 实验配备达标分析-列表
export const getStoreTable = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/labFinishList',
    data
  })
}

// 实验配备达标数量分析-列表
export const getStoreNumTable = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/equipmentSummaryList',
    data
  })
}

// 仪器柜仪器详情
export const oneStoreDetail = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/InstrumentStore/oneStoreDetail',
    data
  })
}

// 实验室配置
export const getlabe = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/Laboratory/laboratoryConfiguration',
    data
  })
}
// 实验配备达标数量分析详情
export const getStoreNumDetail = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/labFinishDetailList',
    data
  })
}

// 实验室使用达标分析-列表
export const getLabUseList = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/labUseSummary',
    data
  })
}

// 仪器设备达标率统计
export const getInsEquRate = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/instrumentEquipment',
    data
  })
}

// 仪器设备利用率
export const getInsEquUseRate = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/useRate',
    data
  })
}

// 资产统计
export const getAssetSummary = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/LaboratorySummary/assetSummary',
    data
  })
}

// 标签实验室列表
export const getlabList = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/SchoolNotes/laboratoryList',
    data
  })
}
// 标签仪器列表
export const getinsList = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/SchoolNotes/instrumentList',
    data
  })
}
// 标签仪器室列表
export const getStoList = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/SchoolNotes/storeList',
    data
  })
}
// 标签仪器室列表
export const getassetsList = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/SchoolNotes/pliesInstrumentList',
    data
  })
}
// 标签仪器室列表
export const getree = () => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/SchoolNotes/storeTree'
  })
}
// 标签导出
// source_type	integer	必填	-	-	类型1实验室2仪器3设备4仪器柜5资产
// source_id id
// template 模板id
export const exportLabel = (data: any) => {
  return myRequest.get<RootObject>({
    url: 'schooldvc/SchoolNotes/exportNoteTemplate',
    params: data
  })
}
export const exportLabelAll = (data: any) => {
  return myRequest.post<RootObject>({
    url: 'schooldvc/SchoolNotes/bunchExport',
    data
  })
}
// 获取学校年
export const findschoolyear = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/swrserveadmin/YearTerm/findschoolyear',
    data
  })
}

