//新建仪器入库信息
export interface AddWarehousingList extends BaseType {
  put: {
    location: {
      school_laboratory_id: number | string //实验室id
      // school_laboratory_name: string //实验室名称
      store_id: number | string //仪器柜id
      number_plies: number | string //层数
      total: number //入库数量
    }[]
    number: string //分类编号
    asset_number: string //学校编号
    source: number //来源
    bacth: string //采购批次
    voucher_number: string //凭证号
    factory: string //厂家
    unit_price: number //单价
  }
}

export interface BaseType {
  base: {
    name: string //名称
    number: string //分类编号
    asset_number: string //学校编号
    specification: string //规格型号
    cost_type: number //价值分类1低值易耗 2非低值易耗
    category: string //分类（不同类型之间用逗号隔开)
    subject: string //学科分类（不同类型之间用逗号隔开）
    is_must: number //配备类型 1必配 2选配
    is_group: number //实验类型 1分组 2 演示
    unit: string //单位
    info: string //功能描述
    number_year: number //使用年限
    number_year_unit: string //使用年限单位
    norm: string //仪器标准
    url: string //图片地址
    type: number // 1仪器
    unit_price: number //单价
    total: number //入库数量
  }
}

export interface RequestData extends BaseType {
  put: {
    location: {
      school_laboratory_name: string //实验室名称
      store_name: string //仪器柜
      number_plies: number //层数
      total: number //入库数量
    }[]
    number: string //分类编号
    asset_number: string //学校编号
    source: number //来源
    bacth: string //采购批次
    voucher_number: string //凭证号
    factory: string //厂家
    unit_price: number //单价
  }
}
