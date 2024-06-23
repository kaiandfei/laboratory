// 实验室列表

export interface StoreListItemType {
  area: number
  color_code: string
  create_time: string
  desc: string
  id: number
  is_del: number
  is_finish: number
  is_must: number
  level: number
  location: string
  qr_code: string
  picture: { url_path: string }
  school_id: number
  subject_type: number
  title: string
}
export interface StoreListType {
  name: string
  list: StoreListItemType[]
}

// 库内详情
export interface StoreDetailType {
  id: number
  list: {
    number_plies: number //第几层
    total: number
    id: number
    number: string
    name: string
    info: string
    type: number
    picture: string
  }[]
  number_plies: number //总层数
  title: string
}

// 基本信息
export interface InstrumentDetail {
  id: number
  is_del: number
  number_plies: number
  numbers: string
  picture: { url_path: string }[]
  qr_code: string
  school_id: number
  school_laboratory_id: number
  school_laboratory_name: string
  subject_id: null
  title: string
  type: number
  user_id: null
  user_name: string
}

//

export interface EquDetailType {
  id: number
  is_del: number
  number_plies: number
  numbers: string
  picture: { url_path: string }[]
  qr_code: string
  school_id: number
  school_laboratory_id: number
  school_laboratory_name: string
  subject_id: null
  title: string
  type: number
  user_id: null
  user_name: string
}
//
export interface InsDetailType {
  id: number
  is_del: number
  number_plies: number
  numbers: string
  picture: { url_path: string }[]
  qr_code: string
  school_id: number
  school_laboratory_id: number
  school_laboratory_name: string
  subject_id: null
  title: string
  type: number
  user_id: null
  user_name: string
}

export interface InsEquDetailType {
  asset_number: string
  bacth: null
  cost_type: number
  create_time: string
  detail: []
  factory: null
  id: number
  info: string
  is_del: number
  is_group: number
  is_must: number
  laboratory_id: null
  lend_num: number
  level: null
  maintenance_num: number
  name: string
  norm: string
  number: string
  number_plies: null
  number_year: number
  number_year_unit: string
  picture: { url_path: string }[]
  qr_code: string
  school_code: string
  school_id: number
  scrap_num: number
  source: number
  specification: string
  status: number
  store_id: null
  total: string
  type: number
  unit: string
  unit_price: null
  user: []
  voucher_number: null
}

// 新增
export interface AddForm {
  id?: number
  type: number
  title: string
  numbers: string
  number_plies: number
  user_id: number | string
  user_name: string
  school_laboratory_id: number
  school_laboratory_name: string
  url: string
}

// 批量新增

export interface BatchAddForm {
  type: number
  num: number
  number_plies: number
  user_id: number | string
  user_name: string
  school_laboratory_id: number
  school_laboratory_name: string
  url: string
}
