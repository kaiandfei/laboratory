// 配备标准
export interface IndexForm {
  type: number
}

// 配备标准 返回数据类型
export interface RequestDataCategory {
  id: number
  title: string
}

export interface RequestDataTplType {
  id: number
  learning_info: RequestDataCategory[]
  rail_max: number
  rail_min: number
  type: number
}

export interface RequestDataType {
  category: RequestDataCategory
  tpls: RequestDataTplType[]
}

// 配备标准 返回数据数据格式
export const RequestDataTpl: RequestDataTplType = {
  id: 1,
  rail_min: 0,
  rail_max: 0,
  learning_info: [
    {
      id: 0,
      title: ''
    }
  ],
  type: 0
}
export const RequestData: RequestDataType = {
  category: {
    id: 0,
    title: ''
  },
  tpls: [RequestDataTpl]
}

// export const RequestDataList: RequestDataType[] = [RequestData]

// 新增配备标准
export interface AddConfigForm {
  title: string
  type: number
}

// 新增轨数范围
export interface AddTracksForm {
  id?: number
  rail_min: number
  rail_max: number
  learning_period_id: number
  rail_category_id?: number
  type?: number
}
// 删除轨数范围
export interface DelTracksForm {
  id: number
}

// 轨数详情
export interface TracksDetailForm {
  rail_id: number
}
export interface SubjectInfoType {
  id: any
  name: string
}

export interface TracksForm {
  data: TracksDetailRequest[]
}
export interface TracksDetailRequest {
  id?: number
  rail_id: number
  subject_id?: any
  subject_info?: SubjectInfoType
  i_level: number
  ii_level: number
  iii_level: number
  other_level: number
  total: number
  is_del: number
}
const SubjectInfo: SubjectInfoType = {
  id: '',
  name: ''
}
export const TracksDetailData: TracksDetailRequest = {
  rail_id: 0,
  subject_id: '',
  subject_info: SubjectInfo,
  i_level: 0,
  ii_level: 0,
  iii_level: 0,
  other_level: 0,
  total: 0,
  is_del: 1
}

// 适用学校
export interface SchoolForm {
  standard_id: number
}
interface ListItem {
  id: number
  name: string
  is_city: number
  is_select: boolean
}
export interface SchoolRequest {
  pro: string
  city: string
  area: string
  list: ListItem[]
}
export const SchoolRequestData: SchoolRequest = {
  pro: '',
  city: '',
  area: '',
  list: [
    {
      id: 0,
      name: '',
      is_city: 0,
      is_select: false
    }
  ]
}
export interface SchoolSelectForm {
  standard_id: number
  school_ids: number[]
}

// 列表

export interface ConfigList {
  type: number
  number: string
  name: string
  cost_name: { title: string }[]
  cost_type: number
  id: number
  info: string
  must: number
  max_total: number
  min_total: number
  norm: string
  number_year: number
  specification: string
  unit: string
  user_id: number
  user_name: string
}

export const configObj: ConfigList = {
  id: 0,
  must: 1,
  min_total: 0,
  max_total: 0,
  number: '',
  name: '',
  cost_type: 0,
  info: '',
  unit: '',
  specification: '',
  number_year: 0,
  norm: '',
  type: 0,
  user_id: 0,
  user_name: '',
  cost_name: [
    {
      title: ''
    }
  ]
}

// 编辑
export interface EditList {
  id: number
  type: number
  rail_id: number
  subject_id: number | string
  number: string
  name: string
  specification: string
  unit: string
  norm: string
  info: string
  is_must: number
  min_total: number
  max_total: number
}

// 列表详情
export interface ListDetail {
  id: number
  info: string
  is_must: number
  name: string
  norm: string
  number: string
  picture: string
  specification: string
  type: number
  unit: string
  number_year: number
  category: { title: string }[]
  update_time: string
  username: string
}
