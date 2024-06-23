import { zsRequest } from '../../token/index'
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
  SchoolSelectForm
} from './types'

// 轨数配备列表
export const getConfig = (data: IndexForm) => {
  return zsRequest.post<RootObject<RequestDataType[]>>({
    url: '/schooldvc/railtemplate/index',
    data
  })
}

// 新建配备列表
export const addConfig = (data: AddConfigForm) => {
  return zsRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/railcategory/add',
    data
  })
}

// 新建轨数范围
export const addTracks = (data: AddTracksForm) => {
  return zsRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/Railtemplate/manage',
    data
  })
}

// 轨数删除
export const delTracks = (data: DelTracksForm) => {
  return zsRequest.post<RootObject<RequestDataType>>({
    url: '/schooldvc/Railtemplate/del',
    data
  })
}

// 轨数详情
export const tracksDetail = (data: TracksDetailForm) => {
  return zsRequest.post<RootObject<TracksDetailRequest[]>>({
    url: '/schooldvc/raillaboratorystandard/labs',
    data
  })
}

// 轨数编辑
export const editTracks = (data: TracksForm) => {
  return zsRequest.post<RootObject<TracksDetailRequest>>({
    url: '/schooldvc/raillaboratorystandard/manage',
    data
  })
}

//适用学校
export const applSchool = (data: SchoolForm) => {
  return zsRequest.post<RootObject<SchoolRequest[]>>({
    url: '/schooldvc/Schoollaboratorystandard/index',
    data
  })
}

//适用学校多选提交
export const saveSchoolSelect = (data: SchoolSelectForm) => {
  return zsRequest.post<RootObject<SchoolRequest>>({
    url: '/schooldvc/Schoollaboratorystandard/manage',
    data
  })
}
