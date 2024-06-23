export interface RequestDataLabName {
  data: {
    id: number
    title: string
  }[]
}


// 变卖列表
export interface saleList {
  id: number
  record_number: string //出借单号
  school_id: number
  realtor: string //出借人
  realtor_id: number
  user_name: string //登记人
  user_id: number
  desc: string
  sale_time: string
  cause: string
  is_del: number
  total: number
  price: number
  detail: {
    id?: number
    number: string
    asset_number: string
    name: string
    specification: string
    total: number //总数
  }[]
}

export const saleData: saleList = {
  id: 1,
  record_number: '', //出借单号
  school_id: 1,
  realtor: '', //出借人
  realtor_id: 1,
  user_name: '', //出借人
  user_id: 1,
  desc: '',
  sale_time: '',
  cause: '',
  is_del: 1,
  total: 1,
  price: 0,
  detail: [
    {
      id: 1,
      number: '',
      asset_number: '',
      name: '',
      specification: '',
      total: 1
    }
  ]
}
