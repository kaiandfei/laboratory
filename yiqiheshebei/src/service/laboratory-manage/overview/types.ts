// 实验室列表

export interface RequestDataItemType {
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
  picture: string
  school_id: number
  subject_type: number
  title: string
  // userIDs: number[]
  // users: string
}

export interface RequestDataLabType {
  count: number
  data: RequestDataItemType[]
}

// 总览列表返回
export const RequestDataItem: any = {
  area: 0,
  color_code: '',
  create_time: '',
  desc: '',
  id: 0,
  is_del: 0,
  is_finish: 0,
  is_must: 0,
  level: 0,
  location: '',
  qr_code: '',
  picture: '',
  school_id: 0,
  subject_type: 0,
  title: '',
  camera: []
  // userIDs: [],
  // users: ''
}
export const RequestData: any = {
  count: 0,
  data: [RequestDataItem]
  // id: 0,
  // name: '',
  // sort: 0,
  // status: 0,
  // sys: 0,
  // tips: ''
}
export interface SelectForm {
  subject?: number
  type?: number
  classify?: number
  is_must?: number
}

export const selectFormData: SelectForm = {
  subject: 0,
  type: 0,
  classify: 0,
  is_must: 0
}

// 实验室详情
export interface DetailForm {
  id: number
}
export interface PathList {
  url_path: string
}
interface ItemList {
  id?: number
  subject_id?: number
  name?: string
}
// 详情返回
export interface RequestDetailType {
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
  build_time: string
  camera: any
  picture: PathList[]
  school_id: number
  subject_type: number
  title: string
  userIDs: number[]
  users: string
  subject: ItemList[]
  type: ItemList[]
}
export const RequestDataDetail: RequestDetailType = {
  area: 0,
  color_code: '',
  create_time: '',
  desc: '',
  id: 0,
  is_del: 0,
  is_finish: 0,
  is_must: 0,
  level: 0,
  location: '',
  qr_code: '',
  build_time: '',
  camera:[],
  picture: [
    {
      url_path: ''
    }
  ],
  school_id: 0,
  subject_type: 0,
  title: '',
  userIDs: [],
  users: '',
  subject: [{ subject_id: 0 }],
  type: [
    {
      name: ''
    }
  ]
}
// 提交时候用
export interface AddFormType {
  area: number
  color_code: string
  desc: string
  is_finish: number
  is_must: number
  level: number
  location: string
  qr_code: string
  picture: string
  subject_type: number
  title: string
  userIDs: string
  users: string
  subject: string
  type: string
}
// 编辑时候用
export interface editFormType {
  id?: number
  area: number
  color_code: string
  desc: string
  is_finish: number
  is_must: number
  level: number
  location: string
  is_order?: number
  build_time?: string
  qr_code: string
  picture: string
  subject_type: number[]
  title: string
  userIDs: number[]
  subject: number[]
  type: number[]
}
export const editForm: any = {
  area: 0,
  color_code: '',
  desc: '',
  is_finish: 0,
  is_must: 1,
  level: 1,
  location: '',
  is_order: 1,
  build_time: '',
  qr_code: '',
  picture: '',
  subject_type: [],
  title: '',
  userIDs: [],
  subject: [],
  type: [],
  camera: {}
}

// 实验室配置返回值
export interface ConfigType {
  id: number
  number: string
  asset_number: string
  name: string
  specification: string
  unit: string
  qr_code?: string
}
export interface LabConfigType extends ConfigType {
  I: number
  II: number
  III: number
}
export const labConfig: LabConfigType = {
  id: 0,
  number: '',
  asset_number: '',
  name: '',
  specification: '',
  I: 0,
  II: 0,
  III: 0,
  unit: ''
}

// 批量配置返回值
export interface bacthLabConfigType extends ConfigType {
  asset_number: string
  level: number
  source: number
  factory: string
  bacth: string
  unit_price: number
  store_id: number
  number_plies: number
  user_name: string
}
export const bacthLabConfig: bacthLabConfigType = {
  id: 0,
  number: '',
  name: '',
  specification: '',
  unit: '',
  asset_number: '',
  level: 1,
  source: 1,
  factory: '',
  bacth: '',
  unit_price: 0,
  store_id: 0,
  number_plies: 1,
  user_name: ''
}

// 设备查询
export interface FilterForm {
  page: number
  keyword: string
  type: number
}
export interface ListType extends ConfigType {
  qr_code: string
}
export interface EquListType {
  count: number
  list: ListType[]
}
export const equipmentListData: EquListType = {
  count: 0,
  list: []
}

// 实验室注意事项
export interface noticeListType {
  code: number
  msg: string
  id: number
  labor_id: number
  title: string
  content: string
  create_time: string
  update_time: string
  is_del: number
}
// 实验室批量配置保存
export interface StoreItemType {
  id: number
  number_plies: number
  is_del: number
  numbers: string
  qr_code: string
  school_id: number
  school_laboratory_id: number
  school_laboratory_name: string
  subject_id: null
  title: string
  type: number
  user_id: number
  user_name: string
  url: string
}

// 所有仪器分类
export interface AllInstrument {
  children: { id: number; title: string }[]
}

// 新建配置
export interface AddConfigForm {
  base: {
    number: string
    asset_number: string
    name: string
    specification: string
    cost_type: number
    info: string
    category: string
    norm: string
    unit: string
    number_year: string
    number_year_unit: string
    subject: string
    url: string
    type: number
  }
  put: {
    store_id: number
    number_plies: number
    school_laboratory_id: number
    school_laboratory_name: string
    level: number
    source: number
    voucher_number: string
    bacth: string
    factory: string
    unit_price: string
    user_name: string
    asset_number: string
    specification: string
  }
}
// 获取某个实验室入参
export interface labPeripheralParam {
  lab_id:number
}
// 获取某个实验室所有设备
export interface labPeripheralType {
  id?: number;
  type?: number;
  type_id?: number;
  device_no?: string;
  group_no?: string;
  device_type?: string;
  labor_id?: number;
  school_id?: number;
  create_time?: string;
  status?: number;
  is_del?: number;
  name?: string;
  img?: string;
}
export interface deviceListParam {
  labId:number
}
// 获取学生终端列表
export interface deviceListType{
  id?: number;
  type?: number;
  type_id?: number;
  device_no?: string;
  group_no?: string;
  device_type?: string;
  labor_id?: number;
  school_id?: number;
  create_time?: string;
  status?: number;
  is_del?: number;
  name?: number;
  img?: string;
}
// 获取学生终端列表
export interface noticeItemType{
  id:number
  title:string
  content:string
}
export interface saveNoticeType{
  labor_id: number;
  notice_list:noticeItemType[]
}
