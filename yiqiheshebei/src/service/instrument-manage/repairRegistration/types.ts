import { number } from 'echarts'

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

// 维修保养列表数据
export interface repairList {
  total: number
  data: {
    id: number
    creat_time: string // 登记时间
    factory: string
    desc: string // 损坏情况
    plan_end_time: string
    status: number //-1（已转报废）1（进行中）2（部分完成）3（完成）
    mode: number //1维修2保养
    user_name: string
    record_number: string
    species: number //种类
    total: number // 数量
    list: {
      name: string
      asset_number: string
      specification: string
      total: number
      status: 1 //
    }[]
  }[]
}

export const repairData: repairList = {
  total: 0,
  data: [
    {
      id: 1,
      creat_time: '', // 登记时间
      factory: '',
      desc: '', // 损坏情况
      plan_end_time: '',
      status: 1,
      mode: 1,
      user_name: '',
      record_number: '',
      species: 0, //种类
      total: 0, // 数量
      list: [
        {
          name: '',
          asset_number: '',
          specification: '',
          total: 0,
          status: 1 //
        }
      ]
    }
  ]
}

// 新增维修、保养登记记录
export interface addRepairList {
  type: number
  mode: number
  factory: string
  start_time: string
  plan_end_time: string
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
  }[]
}

export const addRepairData: addRepairList = {
  type: 1,
  mode: 1,
  factory: '',
  start_time: '',
  plan_end_time: '',
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
      total: 0
    }
  ]
}

// 增加维修仪器列表
export interface addRepairInfo {
  id: number
  hardware_number: string
  bacth: string
  asset_number: string
  school_instrument_id: number
  instrument_id: number
  laboratory_id: number
  laboratory_name: string
  name: string
  number_plies: number
  store_id: number
  store_name: string
  total: number
}

// 获取查询到的仪器信息
export interface instrumnetList {
  id: number
  asset_number: string
  bacth: string
  specification: string
  number: string
  name: string
  stockStatus: boolean
  picture: string
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

// 维修保养登记卡详情
export interface repairDetailList {
  mode: number
  record_number: string
  factory: string
  start_time: string
  complete_time: string
  plan_end_time: string
  desc: string
  pic: {
    url_path: string
  }[]
  status: number
  end_time: string
  list: {
    id: number
    name: string
    bacth: string
    asset_number: string
    laboratory_name: string
    store_name: string
    number_plies: number
    total: number
  }[]
  nuReturn: {
    id: number
    name: string
    asset_number: string
    total: number
  }[]
  returnList: {
    id: number
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    number_plies: number
    total: number
  }[]
}

export const repairDetailData: repairDetailList = {
  mode: 1,
  record_number: '',
  factory: '',
  start_time: '',
  plan_end_time: '',
  complete_time: '',
  desc: '',
  pic: [
    {
      url_path: ''
    }
  ],
  status: 1,
  end_time: '',
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
      bacth: '',
      laboratory_name: '',
      store_name: '',
      number_plies: 1,
      total: 0
    }
  ],
  nuReturn: [
    {
      id: 1,
      name: '',
      asset_number: '',
      total: 0
    }
  ],
  returnList: [
    {
      id: 1,
      name: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      number_plies: 1,
      total: 0
    }
  ]
}

// 查看损耗报废清单
export interface damageList {
  create_time: string
  list: {
    id: number
    bacth: string
    total: number
    name: string
    asset_number: string
  }[]
}

export const damageData: damageList = {
  create_time: '',
  list: [
    {
      id: 1,
      bacth: '',
      total: 0,
      name: '',
      asset_number: ''
    }
  ]
}

// 维修完成登记
export interface repairFinishList {
  id: number
  mode: number
  factory: string
  record_number: string
  create_time: string
  status: number
  complete_time: string
  plan_end_time: string
  desc: string
  pic: {
    id: number
    url_path: string
  }[]
  list: {
    id: number
    bacth: string
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    number_plies: number
    total: number
    repairStatus: number
    instrument_id: number
  }[]
  nuReturn: {
    id: number
    bacth: string
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    record_id: number
    number_plies: number
    specification: string
    total: number
    repairStatus: number
    instrument_id: number
    unReturnNum: number
  }[]
  returnList: {
    id: number
    bacth: string
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    number_plies: number
    total: number
    repairStatus: number
    instrument_id: number
    detail: {
      // id: number
      // asset_number: string
      // name: string
      Pid: number
      bacth: string
      id: number
      // level: number
      laboratory_id: number
      laboratory_name: string
      store_id: number
      store_name: string
      number_plies: number
      total: number
    }[]
  }[]
}

export const repairFinishData: repairFinishList = {
  id: 1,
  mode: 1,
  factory: '',
  record_number: '',
  create_time: '',
  status: 1,
  complete_time: '',
  plan_end_time: '',
  desc: '',
  pic: [
    {
      id: 0,
      url_path: ''
    }
  ],
  list: [
    {
      id: 1,
      bacth: '',
      name: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      number_plies: 1,
      total: 0,
      repairStatus: 1,
      instrument_id: 1
    }
  ],
  nuReturn: [
    {
      id: 1,
      bacth: '',
      name: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      laboratory_id: 1,
      specification: '',
      store_id: 1,
      record_id: 0,
      number_plies: 1,
      total: 0,
      repairStatus: 1,
      instrument_id: 1,
      unReturnNum: 0
    }
  ],
  returnList: [
    {
      id: 1,
      bacth: '',
      name: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      total: 0,
      repairStatus: 1,
      instrument_id: 1,
      detail: [
        {
          // id: number
          // asset_number: string
          // name: string
          Pid: 1,
          bacth: '',
          id: 1,
          // level: 1,
          laboratory_id: 1,
          laboratory_name: '',
          store_id: 1,
          store_name: '',
          number_plies: 1,
          total: 1
        }
      ]
    }
  ]
}

// 提交维修完成登记信息
export interface postRepairRegistrationInfo {
  id: number //记录单
  status: number
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

export const postRepairRegistrationData: postRepairRegistrationInfo = {
  id: 1,
  status: 1,
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

// 维修转损耗、报废
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
    id: number | string
    record_id: number
    store_id: number
    hardware_number: string
    asset_number: string
    name: string
    specification: string
    bacth: string
    total: number
    laboratory_id: number
    instrument_id: number
    laboratory_name: string
    store_name: string
    number_plies: number
    type: number
    num: number
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
      id: 0,
      store_id: 1,
      record_id: 0,
      hardware_number: '',
      asset_number: '',
      name: '',
      specification: '',
      bacth: '',
      total: 0,
      laboratory_id: 1,
      instrument_id: 1,
      laboratory_name: '',
      store_name: '',
      number_plies: 1,
      type: 0,
      num: 0
    }
  ]
}
