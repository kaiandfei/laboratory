export interface RequestDataLabName {
  data: {
    id: number
    title: string
  }[]
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

export const RequestDataLab: RequestDataLabName = {
  data: [
    {
      id: 1,
      title: ''
    }
  ]
}

// 设备损耗、报废登记列表信息
export interface scrapRegistrationList {
  total: number
  data: {
    id: number
    record_number: string
    cause: number // 报废理由 1：
    process_mode: number // 处理方式
    status: number //状态
    create_time: string //登记时间
    user_name: string //登记人
    audit_time: string //审核时间
    cost: number //
    species: number
    audit_user_name: string
    list: {
      name: string
      asset_number: string
      specification: string
      total: number
    }[]
  }[]
}

export const scrapRegistrationData: scrapRegistrationList = {
  total: 0,
  data: [
    {
      id: 1,
      record_number: '',
      cause: 1, // 报废理由 1：
      process_mode: 1, // 处理方式
      status: 1, //状态
      create_time: '', //登记时间
      user_name: '', //登记人
      audit_time: '', //审核时间
      cost: 0, //
      species: 0,
      audit_user_name: '',
      list: [
        {
          name: '',
          asset_number: '',
          specification: '',
          total: 0
        }
      ]
    }
  ]
}

// 获取查询到的设备信息
export interface instrumnetList {
  id: number
  asset_number: string
  bacth: string
  specification: string
  number: string
  name: string
  stockStatus: boolean
  weekList: []
  detail: {
    id: number
    instrumnet_id: number
    laboratory_name: string
    name: string
    number_plies: number
    store_id: number
    store_name: string
    total: number
  }[]
}

export const instrumnetData: instrumnetList = {
  id: 1,
  asset_number: '1',
  bacth: '',
  specification: '',
  number: '',
  name: '',
  stockStatus: false,
  weekList: [],
  detail: [
    {
      id: 1,
      instrumnet_id: 1,
      laboratory_name: '',
      name: '',
      number_plies: 1,
      store_id: 1,
      store_name: '',
      total: 1
    }
  ]
}

// 新增设备损耗、报废登记
export interface addScrapList {
  status: number
  type: number
  mode: number
  cause: number
  process_mode: number
  desc: string
  url: Array<string>
  list: {
    hardware_number: string
    asset_number: string
    name: string
    bacth: string
    specification: string
    laboratory_name: string
    store_name: string
    instrument_id: number
    laboratory_id: number
    store_id: number
    number_plies: number
    total: number
    unit_price: number | string
  }[]
}

export const addScrapData: addScrapList = {
  status: 1,
  type: 2,
  cause: 1,
  mode: 1,
  process_mode: 1,
  desc: '',
  url: [],
  list: [
    {
      hardware_number: '',
      asset_number: '',
      name: '',
      bacth: '',
      specification: '',
      laboratory_name: '',
      store_name: '',
      instrument_id: 1,
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      total: 0,
      unit_price: ''
    }
  ]
}

// 增加损耗、报废设备列表
export interface addScrapInfo {
  id: number
  hardware_number: string
  bacth: string
  asset_number: string
  school_instrument_id: number
  instrument_id: number
  laboratory_name: string
  name: string
  number_plies: number
  store_id: number
  store_name: string
  total: number
}

//查看详情信息
export interface scrapDetailInfo {
  id: number
  mode: number
  cause: number
  record_number: string
  desc: string
  create_time: string
  put_time: string
  process_mode: number
  user_name: string
  price: number
  audit_user_name: string
  audit_time: string
  audit_name: string
  audit_desc: string
  status: number
  pic: {
    id: number
    url_path: string
  }[]
  list: {
    id: number
    name: string
    instrument_id: number | string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    number_plies: number
    specification: string
    total: number
  }[]
}

export const scrapDetailData: scrapDetailInfo = {
  id: 1,
  mode: 1,
  cause: 1,
  record_number: '',
  desc: '',
  create_time: '',
  put_time: '',
  process_mode: 1,
  user_name: '',
  price: 0,
  audit_user_name: '',
  audit_time: '',
  audit_name: '',
  audit_desc: '',
  status: 1,
  pic: [
    {
      id: 1,
      url_path: ''
    }
  ],
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
      instrument_id: '',
      laboratory_name: '',
      specification: '',
      laboratory_id: 1,
      store_id: 1,
      store_name: '',
      number_plies: 1,
      total: 0
    }
  ]
}

// 编辑损耗、报废设备信息详情
export interface editScrapInfoDetail {
  id: number
  mode: number
  cause: number
  record_number: string
  desc: string
  create_time: string
  put_time: string
  process_mode: number
  cost: number
  audit_name: string
  audit_time: string
  audit_desc: string
  status: number
  pic: {
    id: number
    url_path: string
  }[]
  list: {
    id: number
    name: string
    bacth: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    instrument_id: number
    store_id: number
    number_plies: number
    total: number
  }[]
}

export const editScrapInfoDetailData: editScrapInfoDetail = {
  id: 1,
  mode: 1,
  cause: 1,
  record_number: '',
  desc: '',
  create_time: '',
  put_time: '',
  process_mode: 1,
  cost: 0,
  audit_name: '',
  audit_time: '',
  audit_desc: '',
  status: 1,
  pic: [
    {
      id: 1,
      url_path: ''
    }
  ],
  list: [
    {
      id: 1,
      name: '',
      bacth: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      instrument_id: 1,
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      total: 0
    }
  ]
}

//提交的编辑损耗、报废设备信息
export interface editScrapInfo {
  id: number
  type: number
  mode: number
  cause: number
  process_mode: number
  desc: string
  url: Array<string>
  status?: number
  list: {
    id: number
    name: string
    bacth: string
    instrument_id: number
    laboratory_id: number
    store_id: number
    number_plies: number
    total: number
  }[]
}

export const editScrapData: editScrapInfo = {
  id: 1,
  type: 2,
  cause: 1,
  mode: 1,
  process_mode: 1,
  desc: '',
  url: [],
  list: [
    {
      id: 1,
      name: '',
      bacth: '',
      instrument_id: 1,
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      total: 0
    }
  ]
}

// 提交的设备损耗、报废审核信息
export interface instrumentExamineList {
  id: number
  audit_desc: string
  process_mode: number
  status: number
  list: {
    name: string
    id: string | number
    instrument_id: string | number
    asset_number: string
    specification: string
    laboratory_id: number
    store_id: number
    number_plies: number
    laboratory_name: string
    total: number
  }[]
}

export const instrumentExamineData: instrumentExamineList = {
  id: 1,
  audit_desc: '',
  process_mode: 1,
  status: 4,
  list: [
    {
      name: '',
      id: '',
      instrument_id: '',
      store_id: 1,
      number_plies: 0,
      laboratory_id: 1,
      asset_number: '',
      specification: '',
      laboratory_name: '',
      total: 0
    }
  ]
}
