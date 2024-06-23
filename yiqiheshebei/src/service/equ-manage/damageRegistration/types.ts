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

// 获取到的设备损坏、赔偿列表信息
export interface damageRegistrationList {
  total: number
  data: {
    id: number
    record_number: string
    cost: number
    num: number
    create_time: string
    status: number
    desc: string
    damage_man: string
    repay_man: string
    repay_price: string
    repay_time: string
    user_name: string
    list: {
      name: string
      asset_number: string
      specification: string
      total: number
    }[]
  }[]
}

export const damageRegistrationData: damageRegistrationList = {
  total: 0,
  data: [
    {
      id: 1,
      record_number: '',
      cost: 0,
      num: 0,
      create_time: '',
      status: 1,
      desc: '',
      damage_man: '',
      repay_man: '',
      repay_price: '',
      repay_time: '',
      user_name: '',
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
  unit_price: string
  weekList: []
  detail: {
    id: number
    unit_price: string
    instrumnet_id: number
    laboratory_name: string
    name: string
    specification: string
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
  unit_price: '',
  detail: [
    {
      id: 1,
      instrumnet_id: 1,
      laboratory_name: '',
      unit_price: '',
      name: '',
      number_plies: 1,
      specification: '',
      store_id: 1,
      store_name: '',
      total: 1
    }
  ]
}

//新增设备损坏、赔偿登记信息
export interface addDamageRegistrationList {
  type: number
  status: number
  damage_id: number | string
  damage_man: string
  damage_desc: string
  repay_man: string
  repay_id: number | string
  repay_price: number
  repay_time: string
  repay_desc: string
  url: Array<string>
  list: {
    unit_price: string
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

export const addDamageRegistrationData: addDamageRegistrationList = {
  type: 2,
  status: 1,
  damage_id: 1,
  damage_man: '',
  damage_desc: '',
  repay_man: '',
  repay_id: 1,
  repay_price: 0,
  repay_time: '',
  repay_desc: '',
  url: [],
  list: [
    {
      unit_price: '',
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

// 增加损坏、赔偿设备列表
export interface addDamageInfo {
  id: number
  hardware_number: string
  bacth: string
  asset_number: string
  school_instrument_id: number
  instrument_id: number
  laboratory_name: string
  unit_price: string
  specification: string
  name: string
  number_plies: number
  store_id: number
  store_name: string
  total: number
}

// 设备损坏、赔偿详情
export interface instrumentDetailList {
  status: number
  damage_man: string
  desc: string
  subject_id: number
  record_number: string
  create_time: string
  repay_man: string
  user_name: string
  repay_price: string
  repay_time: string
  repay_desc: string
  pic: Array<string>
  list: {
    id: number
    name: string
    asset_number: string
    laboratory_id: number
    specification: string
    store_id: number
    laboratory_name: string
    instrument_id: number
    store_name: string
    number_plies: number
    total: number
  }[]
}

export const instrumnetDetailData: instrumentDetailList = {
  status: 1,
  damage_man: '',
  subject_id: 0,
  desc: '',
  record_number: '',
  create_time: '',
  repay_man: '',
  user_name: '',
  repay_price: '',
  repay_time: '',
  repay_desc: '',
  pic: [],
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
      laboratory_id: 1,
      store_id: 1,
      laboratory_name: '',
      specification: '',
      instrument_id: 1,
      store_name: '',
      number_plies: 1,
      total: 0
    }
  ]
}

// 提交的损坏赔偿登记信息
export interface compensateInfoList {
  id: number
  type: number
  repay_man: string
  status: number
  damage_man: string
  repay_price: string
  repay_time: string
  repay_desc: string
  list: {
    id: number
    name: string
    asset_number: string
    laboratory_id: number
    store_id: number
    laboratory_name: string
    instrument_id: number
    store_name: string
    number_plies: number
    total: number
  }[]
}

export const compensateInfoData: compensateInfoList = {
  id: 1,
  type: 2,
  damage_man: '',
  repay_man: '',
  repay_price: '',
  status: 2,
  repay_time: '',
  repay_desc: '',
  list: [
    {
      id: 1,
      name: '',
      asset_number: '',
      laboratory_id: 1,
      store_id: 1,
      laboratory_name: '',
      instrument_id: 1,
      store_name: '',
      number_plies: 1,
      total: 0
    }
  ]
}

// 设备登记总览列表信息（设备损坏、赔偿）
export interface instrumentRegistrationList {
  total: number
  data: {
    id: number
    asset_number: string
    number: string
    name: string
    specification: string
    unit: string
    status: number // 登记情况1正常2出借3维修保养(对应scrapStatu的出现： )4报废5损坏',
    user_name: string
    create_time: string
    ScrapStatus?: number // '1待提交2待审核3已撤回4审核报废成功5审核报废失败',
    DamageStatus?: number // 1： 未赔偿 2：已赔偿
  }[]
}

export const instrumentRegistrationData: instrumentRegistrationList = {
  total: 0,
  data: [
    {
      id: 1,
      asset_number: '',
      number: '',
      name: '',
      specification: '',
      unit: '',
      status: 1, // 登记情况1正常2出借3维修保养4报废5损坏',
      user_name: '',
      create_time: ''
    }
  ]
}
