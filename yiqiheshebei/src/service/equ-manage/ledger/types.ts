// 仪器编号管理列表
export interface SearchForm {
  page?: number
  number: string
  classify?: number | string
  types?: number
  school_code: string
  subject_id: number | string
}

export interface LedgerList {
  total: number
  data: DataList[]
  year: string
}

export interface DataList {
  id: number
  number: string
  name: string
  specification: string
  unit: string
  total: number
  school_code?: string
  create_time?: string
  voucher_number?: string
  source?: number
  factory?: string
  unit_price?: number
  total_now?: number
}

export const LedgerListData: LedgerList = {
  total: 0,
  data: [
    {
      id: 0,
      number: '',
      name: '',
      specification: '',
      unit: '',
      total: 0,
      school_code: '',
      create_time: '',
      voucher_number: '',
      source: 0,
      factory: '',
      unit_price: 0,
      total_now: 0
    }
  ],
  year: ''
}

// 统计
export interface LedgerStatistical {
  title: string
  year: number
  total: number
  price: number
  allPrice: number
}

// 明细
export interface LedgerDetailList {
  base: {
    classify: { title: string }[]
    id: number
    is_must: number
    name: string
    number: string
    specification: string
    unit: string
    subject: { subject_id: number }[]
  }
  list: ListItem[]
  list2: ListItem[]
}

export interface ListItem {
  create_time: string
  factory: string
  id: number
  source: number
  total: number
  unit_price: string
  user_name: string
  voucher_number: string
}
