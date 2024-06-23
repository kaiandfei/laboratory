// 配备标准
export interface SelectForm {
  subject_id: number
  type: number
}

// 配备标准 返回数据类型
export interface RequestDataChildren {
  id: number
  laboratory_template_id: number
  instrument_number: string
  name: string
  specification: string
  unit: string
  i_level: number
  ii_level: number
  iii_level: number
  type: number
}

export interface RequestData {
  area: number
  create_time: string
  desc: string
  id: number
  is_del: number
  list: RequestDataChildren[]
  name: string
  status: number
  subject_id: number
  type: string
  type_id: number
}

export const requestListItem: RequestDataChildren = {
  i_level: 0,
  laboratory_template_id: 0,
  instrument_number: '',
  id: 0,
  ii_level: 0,
  iii_level: 0,
  name: '',
  specification: '',
  type: 0,
  unit: ''
}

export const requestItem: RequestData = {
  area: 0,
  create_time: '',
  desc: '',
  id: 0,
  is_del: 0,
  list: [requestListItem],
  name: '',
  status: 0,
  subject_id: 0,
  type: '',
  type_id: 0
}

// 新增配置
export interface AddForm {
  id?: number
  type_id: number | string
  subject_id: number | string
  desc: string
  area: number
}
//修改保存
// export interface Formlist {
//   id: number
//   laboratory_template_id?: number
//   instrument_number: string
//   name: string
//   specification: string
//   unit: string
//   i_level: number
//   ii_level: number
//   iii_level: number
// }
export interface SavaForm {
  id: number
  desc: string
  area: number
  list: RequestDataChildren[]
}
