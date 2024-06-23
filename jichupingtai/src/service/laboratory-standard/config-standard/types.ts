// 配置标准
export interface IndexForm {
  type: number
}

// 配置标准 返回数据类型
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

// 配置标准 返回数据数据格式
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

// 新增配置标准
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
  id: number
  name: string
}

export interface TracksForm {
  data: TracksDetailRequest[]
}
export interface TracksDetailRequest {
  id?: number
  rail_id: number
  subject_id?: number
  subject_info?: SubjectInfoType[]
  i_level: number
  ii_level: number
  iii_level: number
  other_level: number
  total: number
  is_del: number
}
export const SubjectInfo: SubjectInfoType = {
  id: 0,
  name: ''
}
export const TracksDetailData: TracksDetailRequest = {
  rail_id: 0,
  subject_id: 0,
  subject_info: [SubjectInfo],
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
export interface ListItem {
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
