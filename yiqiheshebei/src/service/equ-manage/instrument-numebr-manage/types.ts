// 仪器编号管理列表
export interface numberManageList {
  total: number
  data: numberList[]
}

export interface numberList {
  key: number
  number: string
  name: string
  specification: string
  totals: number
  unit: string
  type: number
  detail: {
    id: number
    number: string
    name: string
    specification: string
    total: number
    unit: string
    type: number
    school_laboratory_name: string
    bacth: string
    end_time: string
    unit_price: string
    asset_number: string
    user_name: string
  }[]
}

export const numberManageData: numberManageList = {
  total: 0,
  data: [
    {
      key: 1,
      number: '',
      name: '',
      specification: '',
      totals: 0,
      unit: '',
      type: 1,
      detail: [
        {
          id: 1,
          number: '',
          name: '',
          specification: '',
          total: 0,
          unit: '',
          type: 1,
          school_laboratory_name: '',
          bacth: '',
          end_time: '',
          unit_price: '',
          asset_number: '',
          user_name: ''
        }
      ]
    }
  ]
}

// 仪器详情
export interface instrumentDetailList {
  id: number
  number: string
  asset_number: string
  name: string
  cost_type: number
  is_group: number
  is_must: number
  info: string
  unit: string
  specification: string
  number_year: number
  number_year_unit: string
  norm: string
  bacth: string
  qr_code: string
  end_time: string
  picture: {
    url_path: string
  }[]
  head: {
    user_id: number
    user_name: string
  }[]
  list: {
    lend: {
      lender: string
      lend_id: number
      plan_end_time: string
    }[]
    maintain: {
      lender: string
      lend_id: number
      plan_end_time: string
    }[]
  }
}

export const instrumentDetailData: instrumentDetailList = {
  id: 1,
  number: '',
  asset_number: '',
  name: '',
  cost_type: 1,
  is_group: 1,
  is_must: 1,
  info: '',
  unit: '',
  specification: '',
  number_year: 1,
  number_year_unit: '',
  norm: '',
  bacth: '',
  qr_code: '',
  end_time: '',
  picture: [
    {
      url_path: ''
    }
  ],
  head: [
    {
      user_id: 1,
      user_name: ''
    }
  ],
  list: {
    lend: [
      {
        lender: '',
        lend_id: 1,
        plan_end_time: ''
      }
    ],
    maintain: [
      {
        lender: '',
        lend_id: 1,
        plan_end_time: ''
      }
    ]
  }
}

// 资产编号列表
export interface assetNumberList {
  id: number
  number: string
  name: string
  specification: string
  unit: string
  total: number
  type: number
  bacth: string
  unit_price: string
  factory: string
  school_laboratory: string
  head: string
  end_time: string
  asset_number: string
}

export const assetNumberData: assetNumberList = {
  id: 1,
  name: '',
  number: '',
  specification: '',
  unit: '',
  total: 0,
  type: 1,
  bacth: '',
  unit_price: '',
  factory: '',
  school_laboratory: '',
  head: '',
  end_time: '',
  asset_number: ''
}

//资产编号编辑发送数据
export interface sendData {
  id: number
  asset_number: string
  user: {
    id: number
    name: string
  }[]
}
