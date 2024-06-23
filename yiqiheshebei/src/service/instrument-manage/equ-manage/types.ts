// 实验室名称
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

//库存列表
export interface inventoryList {
  inventory: string //
  lend: string //
  maintenance: string //
  scrap: string //
  total: number //数据总条数
  data: {
    instrumnet_id: number
    number: string //分类编号
    school_id: number // 学校id
    asset_number: string //学校编号(资产编号)
    name: string // 仪器名称
    specification: string //规格型号
    unit: string //单位
    total: number //总库存
    user_num: number //可用数量
    lend_num: number //出街数量
    maintenance_num: number //维修保养数量
    scrap_num: number //损坏报废数量
    category: [] //分类
    cost_type: number //价值分类
    type: number //1仪器2设备
  }[]
}

export const inventoryData: inventoryList = {
  inventory: '',
  lend: '',
  maintenance: '',
  scrap: '',
  total: 1,
  data: [
    {
      instrumnet_id: 1,
      number: '',
      asset_number: '',
      school_id: 1,
      name: '',
      specification: '',
      unit: '',
      total: 1,
      user_num: 1,
      lend_num: 0,
      maintenance_num: 1,
      scrap_num: 1,
      category: [],
      cost_type: 1,
      type: 1
    }
  ]
}

//仪器调拨

export interface allotList {
  school_instrument_id: number
  number: string
  asset_number: string
  name: string
  specification: string
  mode: string | number
  bacth: string
  type: number
  list: {
    type: string
    school_laboratory_id: number | string
    store_id: number | string
    number_plies: number | string
    number: any
    total: number | string
  }[]
  numbers: string
}

export const allotData: allotList = {
  school_instrument_id: 1,
  number: '',
  asset_number: '',
  name: '',
  specification: '',
  mode: 2,
  bacth: '',
  type: 1,
  list: [
    {
      type: '1',
      school_laboratory_id: '',
      store_id: '',
      number_plies: '',
      number: '',
      total: ''
    },
    {
      type: '2',
      school_laboratory_id: '',
      store_id: '',
      number_plies: '',
      number: '',
      total: ''
    }
  ],
  numbers: ''
}

//仪器入库
export interface WarehousingList {
  school_instrument_id: number
  school_instrument_name: string
  unit: string
  number: string
  asset_number: string
  name: string
  specification: string
  type: number
  location: {
    school_laboratory_id: number | string
    store_id: number | string
    number_plies: number | string
    total: number
  }[]
  source: string
  voucher_number: string
  bacth: string | number
  factory: string
  unit_price: string
}

export const warehousingData: WarehousingList = {
  school_instrument_id: 1,
  school_instrument_name: '',
  unit: '',
  number: '',
  asset_number: '',
  name: '',
  specification: '',
  type: 1,
  location: [
    {
      school_laboratory_id: '',
      store_id: '',
      number_plies: '',
      total: 0
    }
  ],
  source: '',
  voucher_number: '',
  bacth: '',
  factory: '',
  unit_price: ''
}
//仪器详情
export interface detailList {
  id: number
  number: string
  asset_number: string
  specification: string
  name: string
  info: string
  unit: string
  number_year: string
  number_year_unit: string
  norm: string
  total: number
  lend_num: number
  maintenance_num: number
  cost_type: number
  picture: {
    url_path: string
  }[]
  is_must: number // 配备类型  1必配2选配
  is_group: number // 实验类型 1分组2演示3两者皆可
  sourceList: {
    source: string
    voucher_number: string
    bacth: string
    factory: string
    total: number
    qr_code: string
  }[]
  locationList: {
    store_name: string
    school_laboratory_name: string
    number_plies: number
    total: number
  }[]
}

export const detailData: detailList = {
  id: 1,
  number: '',
  asset_number: '',
  specification: '',
  name: '',
  info: '',
  unit: '',
  number_year: '',
  number_year_unit: '',
  norm: '',
  total: 0,
  lend_num: 0,
  maintenance_num: 0,
  cost_type: 0,
  picture: [{ url_path: '' }],
  is_must: 1,
  is_group: 1,
  sourceList: [
    {
      source: '',
      voucher_number: '',
      bacth: '',
      factory: '',
      total: 0,
      qr_code: ''
    }
  ],
  locationList: [
    {
      store_name: '',
      school_laboratory_name: '',
      number_plies: 0,
      total: 0
    }
  ]
}

//仪器盘点
export interface checkList {
  school_instrument_id: number
  instrument_id: number
  number: string
  asset_number: string
  name: string
  type: number
  specification: string
  yk: number | string
  bacth: string
  school_laboratory_id: number | string
  store_id: number | string
  number_plies: number | string
  num: number
  pd_desc: string
  pd_time: string
}
export const checkData: checkList = {
  school_instrument_id: 1,
  instrument_id: 1,
  number: '',
  asset_number: '',
  name: '',
  specification: '',
  type: 1,
  yk: '',
  bacth: '',
  school_laboratory_id: '',
  store_id: '',
  number_plies: '',
  num: 0,
  pd_desc: '',
  pd_time: ''
}
