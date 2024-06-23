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

// 出借列表
export interface lendList {
  id: number
  record_number: string //出借单号
  school_id: number
  lender: string //出借人
  lend_id: number
  lend_desc: string
  start_time: string
  plan_end_time: string
  user_name: string
  status: number
  create_time: string
  is_del: number
  end_time: string
  total: number
  species: number
  list: {
    id?: number
    status: number
    name: string
    is_del: number
    specification: string
    return_total: number //已归还仪器数量
    total: number //出借总数
  }[]
}

export const lendData: lendList = {
  id: 1,
  record_number: '', //出借单号
  school_id: 1,
  lender: '', //出借人
  lend_id: 1,
  lend_desc: '',
  start_time: '',
  plan_end_time: '',
  user_name: '',
  status: 1,
  create_time: '',
  is_del: 1,
  end_time: '',
  total: 1,
  species: 1,
  list: [
    {
      status: 1,
      name: '',
      is_del: 0,
      specification: '',
      return_total: 1, //已归还仪器数量
      total: 1 //出借总数
    }
  ]
}

// 新增出借仪器
export interface addLendInstrumnetInfoList {
  lender: string
  lender_id: number | string
  type: number
  lend_desc: string
  start_time: string
  plan_end_time: string
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
  }[]
}

export const addLendInstrumnetInfoData: addLendInstrumnetInfoList = {
  lender: '',
  lender_id: '',
  lend_desc: '',
  type: 1,
  start_time: '',
  plan_end_time: '',
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
      total: 0
    }
  ]
}

// 获取的学校教师信息
export interface getSchoolTeacherList {
  username: string
  id: number
  role: number
}

export const schoolTeacherList: getSchoolTeacherList = {
  username: '',
  id: 1,
  role: 1
}

// 出借仪器（仪器信息查询）
export interface instrumnetList {
  id: number
  asset_number: string
  bacth: string
  specification: string
  number: string
  name: string
  stockStatus: boolean
  weekList: []
  picture: string
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
  picture: '',
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

// 增加出借仪器列表
export interface addLendInfo {
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

// 获取学校教师信息
export interface lenderList {
  id: number
}

// 出借仪器详情
export interface lendDetailList {
  id: number
  record_number: string
  type: number
  lend_desc: string
  lender: string
  plan_end_time: string
  start_time: string
  end_time: string
  return_tips: string
  status: number
  is_del: number
  nuReturn: {
    id: number
    asset_number: string
    name: string
    total: number
  }[]
  returnList: {
    id: number
    asset_number: string
    name: string
    total: number
  }[]
  list: {
    id: number
    name: string
    asset_number: string
    total: number
    laboratory_name: string
    store_name: string
    number_plies: number
  }[]
}

export const lendDetailData: lendDetailList = {
  id: 0,
  record_number: '',
  type: 1,
  lend_desc: '',
  lender: '',
  plan_end_time: '',
  start_time: '',
  end_time: '',
  return_tips: '',
  status: 1,
  is_del: 1,
  nuReturn: [
    {
      id: 1,
      asset_number: '',
      name: '',
      total: 0
    }
  ],
  returnList: [
    {
      id: 1,
      asset_number: '',
      name: '',
      total: 0
    }
  ],
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
      total: 0,
      laboratory_name: '',
      store_name: '',
      number_plies: 0
    }
  ]
}

//出借仪器详情下方清单列表
export interface lendDetailInventoryList {
  creat_time: string
  list: {
    name: string
    id: number
    total: number
    asset_number: string
    bacth: string
  }[]
}

export const lendDetailInventoryData: lendDetailInventoryList = {
  creat_time: '',
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
      total: 0,
      bacth: ''
    }
  ]
}

// 仪器归还登记详情
export interface returnRegistrationList {
  id: number
  is_del: number
  lender: string
  end_time: string
  record_number: string
  plan_end_time: string
  start_time: string
  return_tips: string
  lend_desc: string
  status: number
  list: {
    id: number
    asset_number: string
    name: string
    bacth: string
    laboratory_id: number
    laboratory_name: string
    school_instrument_id: number
    store_id: number
    store_name: string
    number_plies: number
    total: number
    returnStatus: number
  }[]
  nuReturn: {
    id: number
    asset_number: string
    name: string
    bacth: string
    laboratory_id: number
    laboratory_name: string
    school_instrument_id: number
    store_id: number
    unReturnNum: number
    store_name: string
    number_plies: number
    total: number
    returnStatus: number
  }[]
  returnList: {
    id: number
    asset_number: string
    name: string
    bacth: string
    laboratory_id: number
    laboratory_name: string
    store_id: number
    store_name: string
    number_plies: number
    total: number
    returnStatus: number
    school_instrument_id: number
    detail: {
      // id: number
      // asset_number: string
      // name: string
      id: number
      Pid: number
      bacth: string
      laboratory_id: number
      laboratory_name: string
      store_id: number
      store_name: string
      number_plies: number
      total: number
    }[]
  }[]
}

export const returnRegistrationData: returnRegistrationList = {
  id: 1,
  is_del: 1,
  lender: '',
  end_time: '',
  plan_end_time: '',
  record_number: '',
  start_time: '',
  return_tips: '',
  lend_desc: '',
  status: 1,
  list: [
    {
      id: 1,
      asset_number: '',
      name: '',
      bacth: '',
      laboratory_id: 1,
      laboratory_name: '',
      school_instrument_id: 1,
      store_id: 1,
      store_name: '',
      number_plies: 1,
      total: 0,
      returnStatus: 1
    }
  ],
  nuReturn: [
    {
      id: 1,
      asset_number: '',
      name: '',
      bacth: '',
      laboratory_id: 1,
      laboratory_name: '',
      school_instrument_id: 1,
      store_id: 1,
      store_name: '',
      number_plies: 1,
      unReturnNum: 0,
      total: 0,
      returnStatus: 1
    }
  ],
  returnList: [
    {
      id: 1,
      asset_number: '',
      name: '',
      bacth: '',
      laboratory_id: 1,
      laboratory_name: '',
      school_instrument_id: 1,
      store_id: 1,
      store_name: '',
      number_plies: 1,
      total: 1,
      returnStatus: 1,
      detail: [
        {
          // id: 1,
          // asset_number: '',
          // name: '',
          id: 1,
          Pid: 1,
          bacth: '',
          laboratory_id: 1,
          laboratory_name: '',
          store_id: 1,
          store_name: '',
          number_plies: 1,
          total: 0
        }
      ]
    }
  ]
}

//仪器归还信息提交
export interface returnInfoList {
  id: number //记录单
  status: number
  return_tips: string
  list: {
    id: number
    school_instrument_id: number
    laboratory_id: number
    store_id: number
    number_plies: number
    bacth: string
    total: number //借用总数
    return_total: number //归还总数
  }[]
}

export const returnInfoData: returnInfoList = {
  id: 1,
  status: 1,
  return_tips: '',
  list: [
    {
      id: 1,
      school_instrument_id: 1,
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      bacth: '',
      total: 0,
      return_total: 0
    }
  ]
}

// 仪器归还转维修保养登记
export interface repairRegistrationList {
  status: number
  type: number
  mode: number
  factory: string
  start_time: string
  plan_end_time: string
  desc: string
  source_record_number: string
  source_type: number
  url: Array<string>
  list: {
    id: number
    bacth: string
    total: number
    loanTotal: number
    asset_number: string
    name: string
  }[]
}

export const repairRegistrationData: repairRegistrationList = {
  status: 1,
  type: 1,
  mode: 1,
  factory: '',
  start_time: '',
  plan_end_time: '',
  desc: '',
  source_record_number: '',
  source_type: 1,
  url: [],
  list: [
    {
      id: 1,
      asset_number: '',
      loanTotal: 0,
      name: '',
      bacth: '',
      total: 0
    }
  ]
}

// 仪器归还转损耗、报废登记
export interface scrapRegistrationList {
  status: number
  type: number
  mode: number
  cause: number
  process_mode: number
  desc: string
  source_type: number
  source_record_number: string
  url: Array<string>
  list: {
    id: number
    bacth: string
    total: number
    loanTotal: number
    asset_number: string
    name: string
  }[]
}

export const scrapRegistrationData: scrapRegistrationList = {
  status: 1,
  type: 1,
  mode: 1,
  cause: 1,
  process_mode: 1,
  desc: '',
  source_type: 2,
  source_record_number: '',
  url: [],
  list: [
    {
      id: 1,
      bacth: '',
      total: 0,
      loanTotal: 0,
      asset_number: '',
      name: ''
    }
  ]
}

// 仪器转损坏登记
export interface damageRegistrationList {
  status: number
  type: number
  repay_man: number
  repay_time: string
  repay_desc: string
  damage_man: number
  repay_price: number
  desc: string
  source_type: number
  source_record_number: string
  url: Array<string>
  list: {
    id: number
    store_id: number
    laboratory_id: number
    number_plies: number
    asset_number: string
    name: string
    bacth: string
    total: number
    loanTotal: number
  }[]
}

export const damageRegistrationData: damageRegistrationList = {
  status: 1,
  type: 1,
  repay_man: 1,
  repay_time: '',
  repay_desc: '',
  damage_man: 1,
  repay_price: 0,
  desc: '',
  source_type: 1,
  source_record_number: '',
  url: [],
  list: [
    {
      id: 1,
      store_id: 1,
      laboratory_id: 1,
      number_plies: 0,
      asset_number: '',
      name: '',
      bacth: '',
      total: 0,
      loanTotal: 0
    }
  ]
}
