import { myRequest } from '../../token/index'
import { RootObject } from '../../rootObject'
import {
  IndexForm,
  RequestDataType,
  AddConfigForm,
  AddTracksForm,
  DelTracksForm,
  TracksDetailForm,
  TracksForm,
  TracksDetailRequest,
  SchoolForm,
  SchoolRequest,
  SchoolSelectForm,
  ConfigList,
  EditList,
  ListDetail
} from './types'

// 轨数配备列表
export const getConfig = (data: IndexForm) => {
  return myRequest.post<RootObject<RequestDataType[]>>({
    url: '/schooldvc/railtemplate/index',
    data
  })
}

// 新建配备列表
export const addConfig = (data: AddConfigForm) => {
  return myRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/railcategory/add',
    data
  })
}

// 删除配备列表
export const delConfig = (data: { id: number }) => {
  return myRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/railcategory/del',
    data
  })
}

// 轨数详情
export const tracksDetail = (data: TracksDetailForm) => {
  return myRequest.post<RootObject<TracksDetailRequest[]>>({
    url: '/schooldvc/raillaboratorystandard/labs',
    data
  })
}

// 新建轨数范围
export const addTracks = (data: AddTracksForm) => {
  return myRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/Railtemplate/manage',
    data
  })
}

// 轨数删除
export const delTracks = (data: DelTracksForm) => {
  return myRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/Railtemplate/del',
    data
  })
}

// 轨数编辑
export const editTracks = (data: TracksForm) => {
  return myRequest.post<RootObject<TracksDetailRequest>>({
    url: '/schooldvc/raillaboratorystandard/manage',
    data
  })
}

//适用学校
export const applSchool = (data: SchoolForm) => {
  return myRequest.post<RootObject<SchoolRequest[]>>({
    url: '/schooldvc/Schoollaboratorystandard/index',
    data
  })
}

//适用学校多选提交
export const saveSchoolSelect = (data: SchoolSelectForm) => {
  return myRequest.post<RootObject<SchoolRequest>>({
    url: '/schooldvc/Schoollaboratorystandard/manage',
    data
  })
}

// 轨数仪器设备详情
export const tracksInstrumentList = (data: { subject_id: number | string; type: number | string; rail_id: number }) => {
  return myRequest.post<RootObject<ConfigList[]>>({
    url: '/schooldvc/railinstrumentstandard/instrumentStandardList',
    data
  })
}

// 仪器设备配备标准保存
export const instrumentStandardSave = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/railinstrumentstandard/instrumentStandardSave',
    data
  })
}
// 仪器设备配备标准翻页缓存
export const instrumentStandardCached = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/railinstrumentstandard/instrumentStandardCached',
    data
  })
}

// 仪器设备配备标准删除
export const instrumentStandardDel = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/railinstrumentstandard/instrumentStandardButchDel',
    data
  })
}

//轨数仪器设备详情详情
export const instrumentStandardDetail = (data: { id: number }) => {
  return myRequest.post<RootObject<ListDetail>>({
    url: '/schooldvc/railinstrumentstandard/instrumentStandardDetail',
    data
  })
}
//初始化标准
export const initStandard = () => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/Schoollaboratorystandard/initStandard',
  })
}
//初始化标准
export const equInitStandard = () => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/railtemplate/initStandard',
  })
}
//编辑标准名称
export const editRailCateName = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/Schoollaboratorystandard/editRailCateName',
    data
  })
}
//编辑标准名称
export const railImport = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/railinstrumentstandard/import',
    data
  })
}
// 导出数据
export const exportExcel = (data: any) => {
  return myRequest.post<RootObject>({
    url: '/schooldvc/railinstrumentstandard/export',
    data
  })
}
