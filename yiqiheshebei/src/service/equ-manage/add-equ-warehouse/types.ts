//新建仪器入库信息
export interface addWarehousingList {
  base: {
    name: string //名称
    number: string //分类编号
    asset_number: string // 资产编号
    // asset_number: string //学校编号
    specification: string //规格型号
    // cost_type: number //价值分类1低值易耗 2非低值易耗
    category: string //分类（不同类型之间用逗号隔开)
    subject: string //学科分类（不同类型之间用逗号隔开）
    // is_must: number //配备类型 1必配 2选配
    // is_group: number //实验类型 1分组 2 演示
    unit: string //单位
    info: string //功能描述
    number_year: number //使用年限
    number_year_unit: string //使用年限单位
    norm: string //设备标准
    url: {
      url_path: string //图片地址
    }[]
  }
  put: {
    location: {
      laboratory_id: any //实验室id
      school_laboratory_name: string //实验室名称
      store_id: any //仪器柜id
      number_plies: any //层数
      // number: number //入库数量
    }[]
    source: number //来源
    // level: number //分类
    bacth: string //采购批次
    voucher_number: string //凭证号
    factory: string //厂家
    unit_price: string //单价
    username: string // 负责人名字
    user_id: any
  }
}

export const addWarehousingData: addWarehousingList = {
  base: {
    name: '',
    number: '',
    asset_number: '',
    specification: '',
    // cost_type: 0,
    category: '',
    subject: '',
    // is_must: 0,
    // is_group: 0,
    unit: '',
    info: '',
    number_year: 1,
    number_year_unit: '',
    norm: '',
    url: [
      // {
      //   url_path: ''
      // }
    ]
  },
  put: {
    location: [
      {
        laboratory_id: '',
        school_laboratory_name: '',
        store_id: '',
        number_plies: ''
        // number: 0
      }
    ],
    source: 1,
    // level: 1,
    bacth: '',
    voucher_number: '',
    factory: '',
    unit_price: '',
    username: '',
    user_id: null
  }
}
