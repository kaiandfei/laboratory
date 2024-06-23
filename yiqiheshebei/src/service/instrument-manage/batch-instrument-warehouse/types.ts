// 仪器类型
export interface InstrumentAllType {
  data: BatchWarehousingList[]
  total: number
}

export interface AllList {
  id: number
  number: string
  asset_number: string
  name: string
  info: string
  unit: string
  specification: string
  number_year: number
  norm: string
  type: {
    value: number
    content: string
  }
  update_time: string
  user_id: number
  user_name: string
}

//新建仪器入库信息
export interface BatchWarehousingList {
  id?: number
  name: string //名称
  number: string //分类编号
  level?: any
  asset_number: string //学校编号
  category?: any
  specification: string //规格型号
  school_instrument_id: number
  instrument_id: number
  cost_type: number | { value: number } //价值分类1低值易耗 2非低值易耗
  // is_must: number //配备类型 1必配 2选配
  // is_group: number //实验类型 1分组 2 演示
  unit: string //单位
  info: string //功能描述
  number_year: number //使用年限
  norm: string //仪器标准
  school_laboratory_id: number | string //实验室id
  // school_laboratory_name: string //实验室名称
  store_id: number | string //仪器柜id
  number_plies: number | string //层数
  total: number //入库数量
  alltotal?: number //总数量
  putstoragecount?: number //已入库数量
  // source: number //来源
  // bacth: string //采购批次
  // voucher_number: string //凭证号
  // factory: string //厂家
  unit_price: number //单价
  type: number // 1设备 2仪器
  position?: number[] // 1设备 2仪器
  storeList?: any // 1设备 2仪器
  pliesList?: any // 1设备 2仪器
}

//新建仪器入库信息
export interface StoreList {
  id?: number
  title?: string //名称
  number_plies?: number //层数
}


//新建仪器入库信息
export interface PliesList {
  value?: number
  name: string //名称
}

export const batchWarehousing: BatchWarehousingList = {
  id: 0,
  name: '',
  number: '',
  asset_number: '',
  category: [],
  specification: '',
  school_instrument_id: 0,
  instrument_id: 0,
  cost_type: 0,
  //is_must: 0,
  //is_group: 0,
  unit: '',
  info: '',
  number_year: 0,
  norm: '',
  school_laboratory_id: '',
  store_id: '',
  number_plies: '',
  total: 0,
  alltotal: 0,
  putstoragecount: 0,
  // source: 1,
  // bacth: '',
  // voucher_number: '',
  // factory: '',
  unit_price: 0,
  type: 1,
}
