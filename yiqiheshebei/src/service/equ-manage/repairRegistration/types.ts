// 设备维修保养登记列表信息
export interface repairRegistrationList {
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

export const repairRegistrationData: repairRegistrationList = {
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

// 新增设备维修保养登记
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
    school_instrument_id?: number
    laboratory_id: number
    store_id: number
    number_plies: number
    total: number
  }[]
}

// 增加维修保养设备列表
export interface addRepairInfo {
  id: number
  hardware_number: string
  bacth: string
  asset_number: string
  instrument_id: number
  school_instrument_id: number
  laboratory_name: string
  name: string
  number_plies: number
  store_id: number
  store_name: string
  total: number
}

//查看详情信息
export interface repairDetailInfo {
  id: number
  record_number: string
  status: number
  mode: number
  factory: string
  complete_time: string
  start_time: string
  plan_end_time: string
  desc: string
  pic: {
    id: number
    url_path: string
  }[]
  list: {
    id: number
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    number_plies: number
    specification: string
    total: number
  }[]
  returnList: {
    id: number
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    number_plies: number
    specification: string
    total: number
    unReturnNum: number
  }[]
  nuReturn: {
    id: number
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    number_plies: number
    specification: string
    total: number
    residue: number
    unReturnNum: number
  }[]
}

export const repairDetailData: repairDetailInfo = {
  id: 1,
  mode: 1,
  record_number: '',
  desc: '',
  status: 1,
  factory: '',
  complete_time: '',
  start_time: '',
  plan_end_time: '',
  pic: [
    {
      id: 1,
      url_path: ''
    }
  ],
  nuReturn: [
    {
      id: 1,
      name: '',
      asset_number: '',
      laboratory_name: '',
      specification: '',
      laboratory_id: 1,
      store_id: 1,
      store_name: '',
      number_plies: 1,
      total: 0,
      residue: 0,
      unReturnNum: 0
    }
  ],
  returnList: [
    {
      id: 1,
      name: '',
      asset_number: '',
      laboratory_name: '',
      specification: '',
      laboratory_id: 1,
      store_id: 1,
      store_name: '',
      number_plies: 1,
      total: 0,
      unReturnNum: 0
    }
  ],
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
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

// 编辑维修保养设备信息详情
export interface editRepairInfoDetail {
  id: number
  mode: number
  cause: number
  record_number: string
  desc: string
  create_time: string
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
    school_instrument_id: number
    store_id: number
    number_plies: number
    total: number
  }[]
}

export const editRepairInfoDetailData: editRepairInfoDetail = {
  id: 1,
  mode: 1,
  cause: 1,
  record_number: '',
  desc: '',
  create_time: '',
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
      instrument_id: 0,
      school_instrument_id: 0,
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      total: 0
    }
  ]
}

//提交的编辑维修保养设备信息
export interface editRepairInfo {
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
    school_instrument_id: number
    laboratory_id: number
    store_id: number
    number_plies: number
    total: number
  }[]
}

export const editRepairData: editRepairInfo = {
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
      instrument_id: 0,
      school_instrument_id: 0,
      laboratory_id: 1,
      store_id: 1,
      number_plies: 1,
      total: 0
    }
  ]
}

// 提交的设备维修保养审核信息
export interface instrumentExamineList {
  id: number
  audit_desc: string
  process_mode: number
  status: number
  list: {
    name: string
    asset_number: string
    specification: string
    laboratory_id: number
    store_id: number
    laboratory_name: string
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
      store_id: 1,
      laboratory_id: 1,
      asset_number: '',
      specification: '',
      laboratory_name: ''
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
  pic: Array<{ url_path: string }>
  list: {
    id: number
    record_id: number
    bacth: string
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    number_plies: number
    total: number
    repairStatus: number
    instrument_id: number
    school_instrument_id: number
  }[]
  nuReturn: {
    id: number
    record_id: number
    bacth: string
    name: string
    asset_number: string
    laboratory_name: string
    store_name: string
    laboratory_id: number
    store_id: number
    number_plies: number
    specification: string
    total: number
    repairStatus: number
    instrument_id: number
    school_instrument_id: number
    residue: number
    unReturnNum: number
    scrap_total: number
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
    school_instrument_id: number
    detail: {
      // id: number
      // asset_number: string
      // name: string
      Pid: number
      bacth: string
      id: number
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
  pic: [],
  list: [
    {
      id: 1,
      record_id: 0,
      bacth: '',
      name: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      number_plies: 1,
      total: 0,
      repairStatus: 1,
      instrument_id: 0,
      school_instrument_id: 0
    }
  ],
  nuReturn: [
    {
      id: 1,
      record_id: 0,
      bacth: '',
      name: '',
      asset_number: '',
      laboratory_name: '',
      store_name: '',
      laboratory_id: 1,
      specification: '',
      store_id: 1,
      number_plies: 1,
      total: 0,
      repairStatus: 1,
      instrument_id: 0,
      school_instrument_id: 0,
      residue: 0,
      unReturnNum: 0,
      scrap_total: 0
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
      instrument_id: 0,
      school_instrument_id: 0,
      detail: [
        {
          // id: number
          // asset_number: string
          // name: string
          Pid: 1,
          bacth: '',
          id: 1,
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
      school_instrument_id: 0,
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
  price: string | number
  desc: string
  source_type: number
  source_record_number: string
  url: Array<string>
  list: {
    id: number
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
    school_instrument_id: number
    number_plies: number
    type: number
    scrap_total: number
  }[]
}

export const scrapRegistrationData: scrapRegistrationList = {
  status: 1,
  type: 2,
  mode: 1,
  cause: 1,
  process_mode: 1,
  price: '',
  desc: '',
  source_type: 2,
  source_record_number: '',
  url: [],
  list: [
    {
      id: 0,
      record_id: 0,
      store_id: 1,
      hardware_number: '',
      asset_number: '',
      name: '',
      specification: '',
      bacth: '',
      total: 0,
      laboratory_id: 1,
      instrument_id: 0,
      school_instrument_id: 0,
      number_plies: 1,
      type: 0,
      scrap_total: 0,
    }
  ]
}
